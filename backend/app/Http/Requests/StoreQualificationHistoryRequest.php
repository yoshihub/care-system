<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

/**
 * 資格登録リクエストの入力検証。
 *
 * このファイルは何か:
 *   POST /api/qualification-histories で受け取る資格登録パラメータの
 *   形式チェックと、異動区分ごとの追加ルール検証を担う FormRequest。
 *
 * どう使われるか:
 *   - QualificationHistoryController::store の冒頭で自動的に検証される。
 *   - 通過した値だけが QualificationRegistrationService::register に渡る。
 *
 * 設計メモ:
 *   - 業務ロジック本体 (被保険者の作成・イベントの処理済み更新など) は Service 側。
 *   - ACQUIRE / LOSE では開始日・終了日・事由コードの必須条件が異なるため、
 *     withValidator で区分別の追加検証を行う。
 */
class StoreQualificationHistoryRequest extends FormRequest
{
    /** 資格異動区分 */
    private const CHANGE_TYPES = [
        'ACQUIRE',
        'CHANGE',
        'LOSE',
        'CANCEL',
        'RECOVER',
    ];

    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'source_event_id' => ['required', 'integer', 'exists:resident_change_events,id'],
            'change_type' => ['required', 'string', Rule::in(self::CHANGE_TYPES)],
            'qualification_reason_code' => ['nullable', 'string', 'max:8'],
            'qualification_date' => ['required', 'date'],
            'notification_date' => ['nullable', 'date'],
            'qualification_start_date' => ['nullable', 'date'],
            'qualification_end_date' => ['nullable', 'date'],
        ];
    }

    /**
     * 区分ごとの追加検証。
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $data = $validator->getData();

            // 開始日・終了日の前後関係
            $start = $data['qualification_start_date'] ?? null;
            $end = $data['qualification_end_date'] ?? null;

            if ($start !== null && $end !== null && $end < $start) {
                $validator->errors()->add(
                    'qualification_end_date',
                    '資格終了日は資格開始日以降の日付を指定してください。'
                );
            }

            $changeType = $data['change_type'] ?? null;

            // 区分ごとの必須項目 (Laravel の rules だけでは表現しにくい条件)
            if ($changeType === 'ACQUIRE' && empty($data['qualification_start_date'])) {
                $validator->errors()->add(
                    'qualification_start_date',
                    '資格取得の場合は資格開始日が必須です。'
                );
            }

            if ($changeType === 'LOSE' && empty($data['qualification_end_date'])) {
                $validator->errors()->add(
                    'qualification_end_date',
                    '資格喪失の場合は資格終了日が必須です。'
                );
            }

            if (in_array($changeType, ['ACQUIRE', 'LOSE'], true) && empty($data['qualification_reason_code'])) {
                $validator->errors()->add(
                    'qualification_reason_code',
                    '資格取得・喪失の場合は資格事由コードが必須です。'
                );
            }
        });
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'source_event_id.required' => '対象の住民異動イベントは必須です。',
            'source_event_id.exists' => '指定された住民異動イベントが見つかりません。',
            'change_type.required' => '異動区分は必須です。',
            'change_type.in' => '異動区分の値が不正です。',
            'qualification_date.required' => '資格日は必須です。',
            'qualification_date.date' => '資格日は日付形式で指定してください。',
            'notification_date.date' => '届出日は日付形式で指定してください。',
            'qualification_start_date.date' => '資格開始日は日付形式で指定してください。',
            'qualification_end_date.date' => '資格終了日は日付形式で指定してください。',
        ];
    }
}
