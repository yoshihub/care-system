<?php

namespace App\Models;

use Database\Factories\ResidentChangeEventFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * 住民異動イベント Eloquent モデル (resident_change_events)。
 *
 * このファイルは何か:
 *   住民記録側で起きた異動 (65歳到達・転入・転出・死亡・住所変更・氏名変更) を、
 *   介護保険システムが「これから処理する予定の出来事」として受け取り溜める入口テーブルへの
 *   ORM マッピング。
 *
 * どう使われるか:
 *   - CSV 取込 (ResidentChangeImportService) または手入力 API でレコードが作られる。
 *   - 一覧画面で未処理 (pending) を確認し、資格登録 (QualificationRegistrationService) に進む。
 *   - 処理完了後は process_status を processed に更新し、二重処理を防ぐ。
 *
 * 設計メモ:
 *   - 登録時点の氏名・住所をスナップショットとして保持する (あとから住民票が変わっても不変)。
 *   - ここにレコードがあるだけでは被保険者は作られない。資格登録が実体化のトリガー。
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

    /** 未処理（資格登録待ち） */
    public const STATUS_PENDING = 'pending';

    /** 処理済み（資格登録などが完了） */
    public const STATUS_PROCESSED = 'processed';

    /** エラー（処理失敗。error_message に理由） */
    public const STATUS_ERROR = 'error';

    /**
     * 未処理かどうか。
     */
    public function isPending(): bool
    {
        return $this->process_status === self::STATUS_PENDING;
    }

    /**
     * 処理済みかどうか。
     */
    public function isProcessed(): bool
    {
        return $this->process_status === self::STATUS_PROCESSED;
    }

    /**
     * エラー状態かどうか。
     */
    public function isError(): bool
    {
        return $this->process_status === self::STATUS_ERROR;
    }

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
