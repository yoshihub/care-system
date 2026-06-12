<?php

namespace App\Services;

use App\Models\InsuredPerson;
use App\Models\QualificationHistory;
use App\Models\ResidentChangeEvent;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

/**
 * 住民異動イベントをもとに資格登録を行う。
 *
 * 被保険者の作成/更新、資格履歴の追加、イベントの処理済み更新までを
 * 1トランザクションで実行する。
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
            $event = ResidentChangeEvent::query()
                ->lockForUpdate()
                ->find($input['source_event_id']);

            if ($event === null) {
                throw new InvalidArgumentException('指定された住民異動イベントが見つかりません。');
            }

            if (! $event->isPending()) {
                throw new InvalidArgumentException('未処理の住民異動イベントのみ資格登録できます。');
            }

            $person = $this->resolveInsuredPerson($event, $input);
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

            $this->syncInsuredPersonState($person, $event, $input);
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

        if ($input['change_type'] === 'ACQUIRE') {
            if ($existing !== null) {
                throw new InvalidArgumentException('同じ住民番号の被保険者が既に登録されています。');
            }

            return InsuredPerson::create($this->buildNewInsuredPersonAttributes($event, $input));
        }

        if ($existing === null) {
            throw new InvalidArgumentException('資格変更・喪失の対象となる被保険者が見つかりません。');
        }

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
