<?php

namespace App\Models;

use Database\Factories\QualificationHistoryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * 資格履歴。
 *
 * 被保険者の介護保険資格がどう変わってきたか (取得・変更・喪失・取消・回復) を
 * 時系列で1行ずつ残す履歴。被保険者ごとに、いま効いている1行を is_latest=true で表す。
 */
#[Fillable([
    'insured_person_id',
    'source_event_id',
    'change_type',
    'qualification_reason_code',
    'insured_type_code',
    'qualification_date',
    'notification_date',
    'qualification_start_date',
    'qualification_end_date',
    'is_latest',
    'memo',
])]
class QualificationHistory extends Model
{
    /** @use HasFactory<QualificationHistoryFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'insured_person_id' => 'integer',
            'source_event_id' => 'integer',
            'qualification_date' => 'date',
            'notification_date' => 'date',
            'qualification_start_date' => 'date',
            'qualification_end_date' => 'date',
            'is_latest' => 'boolean',
        ];
    }

    /**
     * この履歴が属する被保険者。
     *
     * @return BelongsTo<InsuredPerson, $this>
     */
    public function insuredPerson(): BelongsTo
    {
        return $this->belongsTo(InsuredPerson::class);
    }

    /**
     * この履歴を生むきっかけになった住民異動イベント (手入力登録時は無いため任意)。
     *
     * @return BelongsTo<ResidentChangeEvent, $this>
     */
    public function sourceEvent(): BelongsTo
    {
        return $this->belongsTo(ResidentChangeEvent::class, 'source_event_id');
    }
}
