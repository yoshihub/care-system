<?php

namespace App\Services;

use App\Models\InsuredPerson;
use App\Models\QualificationHistory;
use App\Models\ResidentChangeEvent;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

/**
 * 資格登録の業務ロジック。
 *
 * このファイルは何か:
 *   住民異動イベント (resident_change_events) を起点に、被保険者 (insured_persons) の
 *   作成・更新と資格履歴 (qualification_histories) の追加を行う中核サービス。
 *   画面や API から渡された入力を検証済みとして受け取り、DB 更新の一連の流れを担う。
 *
 * どう使われるか:
 *   - QualificationHistoryController::store から register() が呼ばれる。
 *   - 未処理 (pending) のイベントに対してのみ実行できる。
 *   - 正常終了時はイベントを processed にし、被保険者・資格履歴・イベントをまとめて返す。
 *
 * 設計メモ:
 *   - 全処理を 1 トランザクションにまとめ、途中失敗時はロールバックする。
 *   - 被保険者番号の採番は InsuredNumberService、イベント状態更新は
 *     ResidentChangeEventStatusService に委譲する。
 *   - 異動区分 (ACQUIRE / CHANGE / LOSE / RECOVER / CANCEL) ごとに
 *     被保険者本体へ反映する項目が異なる。
 */
class QualificationRegistrationService
{
    public function __construct(
        private readonly InsuredNumberService $insuredNumberService,
        private readonly ResidentChangeEventStatusService $eventStatusService,
    ) {}

    /**
     * 資格登録を実行する。
     *
     * @param  array{
     *   source_event_id: int,
     *   change_type: string,
     *   qualification_reason_code?: string|null,
     *   qualification_date: string,
     *   notification_date?: string|null,
     *   qualification_start_date?: string|null,
     *   qualification_end_date?: string|null
     * }  $input  StoreQualificationHistoryRequest で検証済みの入力
     * @return array{
     *   insured_person: InsuredPerson,
     *   qualification_history: QualificationHistory,
     *   source_event: ResidentChangeEvent
     * }
     */
    public function register(array $input): array
    {
        return DB::transaction(function () use ($input) {
            // ---- 対象イベントの取得と前提チェック --------------------------

            // 同時実行で二重登録されないよう、イベント行をロックして取得する。
            $event = ResidentChangeEvent::query()
                ->lockForUpdate()
                ->find($input['source_event_id']);

            if ($event === null) {
                throw new InvalidArgumentException('指定された住民異動イベントが見つかりません。');
            }

            if (! $event->isPending()) {
                throw new InvalidArgumentException('未処理の住民異動イベントのみ資格登録できます。');
            }

            // ---- 被保険者の解決と資格履歴の追加 --------------------------

            // 取得 (ACQUIRE) なら新規作成、それ以外は既存被保険者を更新対象とする。
            $person = $this->resolveInsuredPerson($event, $input);

            // 新しい履歴を is_latest=true にする前に、既存の最新フラグを外す。
            $this->clearLatestQualificationHistory($person);

            $history = QualificationHistory::create([
                'insured_person_id' => $person->id,
                'source_event_id' => $event->id,
                'change_type' => $input['change_type'],
                'qualification_reason_code' => $input['qualification_reason_code']
                    ?? $event->qualification_reason_code,
                'insured_type_code' => $person->insured_type_code,
                'qualification_date' => $input['qualification_date'],
                'notification_date' => $input['notification_date'] ?? null,
                'qualification_start_date' => $input['qualification_start_date'] ?? null,
                'qualification_end_date' => $input['qualification_end_date'] ?? null,
                'is_latest' => true,
            ]);

            // 被保険者本体の現在状態 (status・資格日など) を履歴内容に合わせて更新する。
            $this->syncInsuredPersonState($person, $event, $input);

            // イベントを処理済みにし、一覧画面で未処理と区別できるようにする。
            $processedEvent = $this->eventStatusService->markAsProcessed($event);

            return [
                'insured_person' => $person->refresh(),
                'qualification_history' => $history,
                'source_event' => $processedEvent,
            ];
        });
    }

    /**
     * 異動区分に応じて被保険者を新規作成または取得する。
     */
    private function resolveInsuredPerson(ResidentChangeEvent $event, array $input): InsuredPerson
    {
        $existing = InsuredPerson::query()
            ->where('municipality_code', $event->municipality_code)
            ->where('resident_no', $event->resident_no)
            ->lockForUpdate()
            ->first();

        // 資格取得: 同一自治体・住民番号の被保険者がいなければ新規作成
        if ($input['change_type'] === 'ACQUIRE') {
            if ($existing !== null) {
                throw new InvalidArgumentException('同じ住民番号の被保険者が既に登録されています。');
            }

            return InsuredPerson::create($this->buildNewInsuredPersonAttributes($event, $input));
        }

        // 変更・喪失など: 既存被保険者が必須
        if ($existing === null) {
            throw new InvalidArgumentException('資格変更・喪失の対象となる被保険者が見つかりません。');
        }

        // 住所変更・氏名変更: イベントのスナップショットを被保険者本体へ反映
        if ($input['change_type'] === 'CHANGE') {
            $existing->fill($this->buildChangedAttributesFromEvent($event));
            $existing->save();
        }

        return $existing;
    }

    /**
     * 新規被保険者の登録内容を組み立てる。
     *
     * @return array<string, mixed>
     */
    private function buildNewInsuredPersonAttributes(
        ResidentChangeEvent $event,
        array $input
    ): array {
        return [
            'municipality_code' => $event->municipality_code,
            'insurer_no' => $event->municipality_code,
            'resident_no' => $event->resident_no,
            'insured_no' => $this->insuredNumberService->generateNext(),
            'name' => $event->name,
            'kana' => $event->kana,
            'birth_date' => $event->birth_date,
            'gender_code' => $event->gender_code,
            'postal_code' => $event->postal_code,
            'pref_name' => $event->pref_name,
            'city_name' => $event->city_name,
            'town_name' => $event->town_name,
            'addr_line' => $event->addr_line,
            'addr_building' => $event->addr_building,
            'insured_type_code' => '1',
            'status' => 'active',
            'latest_qualification_date' => $input['qualification_date'],
            'qualification_start_date' => $input['qualification_start_date'],
            'qualification_end_date' => null,
            'care_application_in_progress' => $event->care_application_in_progress,
        ];
    }

    /**
     * 住所変更・氏名変更時に被保険者本体へ反映する項目。
     *
     * @return array<string, mixed>
     */
    private function buildChangedAttributesFromEvent(ResidentChangeEvent $event): array
    {
        return [
            'name' => $event->name,
            'kana' => $event->kana,
            'postal_code' => $event->postal_code,
            'pref_name' => $event->pref_name,
            'city_name' => $event->city_name,
            'town_name' => $event->town_name,
            'addr_line' => $event->addr_line,
            'addr_building' => $event->addr_building,
        ];
    }

    /**
     * 資格履歴登録後に被保険者本体の現在状態を更新する。
     */
    private function syncInsuredPersonState(
        InsuredPerson $person,
        ResidentChangeEvent $event,
        array $input
    ): void {
        $person->latest_qualification_date = $input['qualification_date'];

        // 区分ごとに被保険者の資格状態 (status) と開始日・終了日を切り替える
        if ($input['change_type'] === 'ACQUIRE') {
            $person->status = 'active';
            $person->qualification_start_date = $input['qualification_start_date'];
            $person->qualification_end_date = null;
        }

        if ($input['change_type'] === 'CHANGE') {
            $person->fill($this->buildChangedAttributesFromEvent($event));
        }

        if ($input['change_type'] === 'LOSE') {
            $person->status = 'lost';
            $person->qualification_end_date = $input['qualification_end_date'];
        }

        if ($input['change_type'] === 'RECOVER') {
            $person->status = 'active';
            $person->qualification_end_date = null;
            if (! empty($input['qualification_start_date'])) {
                $person->qualification_start_date = $input['qualification_start_date'];
            }
        }

        if ($input['change_type'] === 'CANCEL') {
            $person->status = 'lost';
            $person->qualification_end_date = $input['qualification_end_date']
                ?? $input['qualification_date'];
        }

        $person->save();
    }

    /**
     * これまでの最新資格履歴フラグを外す。
     */
    private function clearLatestQualificationHistory(InsuredPerson $person): void
    {
        QualificationHistory::query()
            ->where('insured_person_id', $person->id)
            ->where('is_latest', true)
            ->update(['is_latest' => false]);
    }
}
