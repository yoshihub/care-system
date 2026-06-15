<?php

namespace App\Http\Resources;

use App\Models\CertificateIssueHistory;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * 証発行履歴 API レスポンス整形 (CertificateIssueHistoryResource)。
 *
 * このファイルは何か:
 *   CertificateIssueHistory モデルを JSON に変換する Laravel API Resource。
 *   証種別・発行理由・発行日・PDF パス等を返す。
 *
 * どう使われるか:
 *   - 被保険者詳細 API の certificate_issue_histories 配列として利用。
 *   - フロントの「証発行履歴」タブがテーブル表示する。
 *
 * 設計メモ:
 *   - PoC では参照のみ。登録・PDF 生成 API は未実装 (FLOW-02-02 以降)。
 *   - is_latest で現在有効な証を識別する。
 *
 * @mixin CertificateIssueHistory
 */
class CertificateIssueHistoryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'insured_person_id' => $this->insured_person_id,
            'form_id' => $this->form_id,
            'certificate_type' => $this->certificate_type,
            'application_type_code' => $this->application_type_code,
            'application_status_code' => $this->application_status_code,
            'issue_status_code' => $this->issue_status_code,
            'issue_reason_code' => $this->issue_reason_code,
            'decision_date' => $this->decision_date?->format('Y-m-d'),
            'issue_date' => $this->issue_date?->format('Y-m-d'),
            'expiry_date' => $this->expiry_date?->format('Y-m-d'),
            'returned_at' => $this->returned_at?->toIso8601String(),
            'pdf_path' => $this->pdf_path,
            'is_latest' => $this->is_latest,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
