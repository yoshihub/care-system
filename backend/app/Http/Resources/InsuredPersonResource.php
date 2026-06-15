<?php

namespace App\Http\Resources;

use App\Models\InsuredPerson;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * 被保険者一覧 API レスポンス整形 (InsuredPersonResource)。
 *
 * このファイルは何か:
 *   InsuredPerson モデルを JSON に変換する Laravel API Resource。
 *   一覧・検索向けの簡易表現 (基本属性 + 最新資格状態) を返す。
 *
 * どう使われるか:
 *   - GET /api/insured-persons の index レスポンス各要素として利用される。
 *   - フロントの被保険者一覧画面 (RSC) が BFF 経由で受け取る。
 *
 * 設計メモ:
 *   - 詳細画面向けのネスト構造は InsuredPersonDetailResource に委譲する。
 *   - 日付は YYYY-MM-DD 文字列に統一する。
 *
 * @mixin InsuredPerson
 */
class InsuredPersonResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'municipality_code' => $this->municipality_code,
            'insured_no' => $this->insured_no,
            'resident_no' => $this->resident_no,
            'name' => $this->name,
            'kana' => $this->kana,
            'birth_date' => $this->birth_date?->format('Y-m-d'),
            'gender_code' => $this->gender_code,
            'insured_type_code' => $this->insured_type_code,
            'status' => $this->status,
            'qualification_start_date' => $this->qualification_start_date?->format('Y-m-d'),
            'qualification_end_date' => $this->qualification_end_date?->format('Y-m-d'),
            'care_application_in_progress' => $this->care_application_in_progress,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
