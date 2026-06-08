<?php

namespace App\Http\Resources;

use App\Models\ReissueApplication;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * 再交付申請のJSON表現。
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
