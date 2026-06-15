<?php

namespace App\Http\Resources;

use App\Models\ReissueApplication;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * 再交付申請 API レスポンス整形 (ReissueApplicationResource)。
 *
 * このファイルは何か:
 *   ReissueApplication モデルを JSON に変換する Laravel API Resource。
 *   申請日・理由・申請者・返還状況等を返す。
 *
 * どう使われるか:
 *   - 被保険者詳細 API の reissue_applications 配列として利用。
 *   - フロントの「再交付申請」タブがテーブル表示する。
 *
 * 設計メモ:
 *   - PoC では参照のみ。申請登録 API は未実装 (FLOW-02-02 以降)。
 *   - reissued_issue_history_id で再発行結果の証履歴と紐づけ可能。
 *
 * @mixin ReissueApplication
 */
class ReissueApplicationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'insured_person_id' => $this->insured_person_id,
            'certificate_type' => $this->certificate_type,
            'application_date' => $this->application_date?->format('Y-m-d'),
            'application_reason_code' => $this->application_reason_code,
            'application_status_code' => $this->application_status_code,
            'applicant_name' => $this->applicant_name,
            'applicant_relationship_code' => $this->applicant_relationship_code,
            'applicant_phone' => $this->applicant_phone,
            'return_status_code' => $this->return_status_code,
            'return_date' => $this->return_date?->format('Y-m-d'),
            'approval_date' => $this->approval_date?->format('Y-m-d'),
            'reissued_issue_history_id' => $this->reissued_issue_history_id,
            'remarks' => $this->remarks,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
