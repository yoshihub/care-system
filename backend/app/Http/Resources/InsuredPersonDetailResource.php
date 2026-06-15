<?php

namespace App\Http\Resources;

use App\Models\InsuredPerson;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * 被保険者詳細 API レスポンス整形 (InsuredPersonDetailResource)。
 *
 * このファイルは何か:
 *   1被保険者の基本情報と、関連する資格履歴・証発行履歴・再交付申請を
 *   ネストした JSON に変換する Laravel API Resource。
 *
 * どう使われるか:
 *   - GET /api/insured-persons/{id} の show レスポンスとして利用される。
 *   - フロントの被保険者詳細画面 (タブ構成) が各セクションを描画する。
 *
 * 設計メモ:
 *   - basic_info に被保険者本体をまとめ、履歴系は専用 Resource で配列化する。
 *   - 一覧 API より項目が多いため、InsuredPersonResource とは用途を分離している。
 *
 * @mixin InsuredPerson
 */
class InsuredPersonDetailResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            // 被保険者本体の現在状態 (一覧 Resource より詳細な項目を含む)
            'basic_info' => [
                'id' => $this->id,
                'municipality_code' => $this->municipality_code,
                'insurer_no' => $this->insurer_no,
                'resident_no' => $this->resident_no,
                'insured_no' => $this->insured_no,
                'name' => $this->name,
                'kana' => $this->kana,
                'birth_date' => $this->birth_date?->format('Y-m-d'),
                'gender_code' => $this->gender_code,
                'postal_code' => $this->postal_code,
                'pref_name' => $this->pref_name,
                'city_name' => $this->city_name,
                'town_name' => $this->town_name,
                'addr_line' => $this->addr_line,
                'addr_building' => $this->addr_building,
                'insured_type_code' => $this->insured_type_code,
                'status' => $this->status,
                'latest_qualification_date' => $this->latest_qualification_date?->format('Y-m-d'),
                'qualification_start_date' => $this->qualification_start_date?->format('Y-m-d'),
                'qualification_end_date' => $this->qualification_end_date?->format('Y-m-d'),
                'current_certificate_status_code' => $this->current_certificate_status_code,
                'care_application_in_progress' => $this->care_application_in_progress,
                'notes' => $this->notes,
                'created_at' => $this->created_at?->toIso8601String(),
                'updated_at' => $this->updated_at?->toIso8601String(),
            ],
            // Controller で eager load 済みの関連履歴 (未 load 時はキーごと省略)
            'qualification_histories' => QualificationHistoryResource::collection(
                $this->whenLoaded('qualificationHistories')
            ),
            'certificate_issue_histories' => CertificateIssueHistoryResource::collection(
                $this->whenLoaded('certificateIssueHistories')
            ),
            'reissue_applications' => ReissueApplicationResource::collection(
                $this->whenLoaded('reissueApplications')
            ),
        ];
    }
}
