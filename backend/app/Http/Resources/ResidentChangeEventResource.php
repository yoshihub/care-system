<?php

namespace App\Http\Resources;

use App\Models\ResidentChangeEvent;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * 住民異動イベント API レスポンス整形 (ResidentChangeEventResource)。
 *
 * このファイルは何か:
 *   ResidentChangeEvent モデルを JSON に変換する Laravel API Resource。
 *   異動内容・処理状態・スナップショット住所などを返す。
 *
 * どう使われるか:
 *   - GET /api/resident-change-events (一覧)、資格登録 API レスポンス内の event 等で利用。
 *   - フロントの住民異動一覧・資格登録画面が表示に使う。
 *
 * 設計メモ:
 *   - 日付は YYYY-MM-DD、日時は ISO 8601 文字列に統一する。
 *   - process_status (pending / processed) をそのまま返し、画面側でバッジ表示する。
 *
 * @mixin ResidentChangeEvent
 */
class ResidentChangeEventResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'event_uid' => $this->event_uid,
            'municipality_code' => $this->municipality_code,
            'resident_no' => $this->resident_no,
            'event_type' => $this->event_type,
            'event_date' => $this->event_date?->format('Y-m-d'),
            'qualification_reason_code' => $this->qualification_reason_code,
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
            'care_application_in_progress' => $this->care_application_in_progress,
            'source_type' => $this->source_type,
            'process_status' => $this->process_status,
            'processed_at' => $this->processed_at?->toIso8601String(),
            'error_message' => $this->error_message,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
