<?php

namespace App\Models;

use Database\Factories\ResidentChangeEventFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * 住民異動イベント。
 *
 * 住民記録側で起きた異動 (65歳到達・転入・転出・死亡・住所変更・氏名変更) を、
 * CSV取込または手入力で受け取って溜めておく「未処理の異動メモ」を表す。
 * このレコードを資格登録処理にかけることで、被保険者や資格履歴が作られる。
 */
#[Fillable([
    'event_uid',
    'municipality_code',
    'resident_no',
    'event_type',
    'event_date',
    'qualification_reason_code',
    'name',
    'kana',
    'birth_date',
    'gender_code',
    'postal_code',
    'pref_name',
    'city_name',
    'town_name',
    'addr_line',
    'addr_building',
    'care_application_in_progress',
    'source_type',
    'import_file_name',
    'row_no',
    'process_status',
    'processed_at',
    'error_message',
])]
class ResidentChangeEvent extends Model
{
    /** @use HasFactory<ResidentChangeEventFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'event_date' => 'date',
            'birth_date' => 'date',
            'care_application_in_progress' => 'boolean',
            'row_no' => 'integer',
            'processed_at' => 'datetime',
        ];
    }
}
