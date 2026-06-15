<?php

namespace App\Http\Resources;

use App\Models\QualificationHistory;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * 資格履歴 API レスポンス整形 (QualificationHistoryResource)。
 *
 * このファイルは何か:
 *   QualificationHistory モデルを JSON に変換する Laravel API Resource。
 *   異動区分・資格理由・有効期間などを返す。
 *
 * どう使われるか:
 *   - POST /api/qualification-histories (資格登録) のレスポンス本体として利用。
 *   - 被保険者詳細の qualification_histories 配列でも利用。
 *
 * 設計メモ:
 *   - is_latest フラグで「現在有効な履歴行」を識別できる。
 *   - source_event_id により起点イベントへのトレースが可能。
 *
 * @mixin QualificationHistory
 */
class QualificationHistoryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'insured_person_id' => $this->insured_person_id,
            'source_event_id' => $this->source_event_id,
            'change_type' => $this->change_type,
            'qualification_reason_code' => $this->qualification_reason_code,
            'insured_type_code' => $this->insured_type_code,
            'qualification_date' => $this->qualification_date?->format('Y-m-d'),
            'notification_date' => $this->notification_date?->format('Y-m-d'),
            'qualification_start_date' => $this->qualification_start_date?->format('Y-m-d'),
            'qualification_end_date' => $this->qualification_end_date?->format('Y-m-d'),
            'is_latest' => $this->is_latest,
            'memo' => $this->memo,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
