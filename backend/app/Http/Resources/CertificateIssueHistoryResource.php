<?php

namespace App\Http\Resources;

use App\Models\CertificateIssueHistory;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * 証発行履歴のJSON表現。
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
