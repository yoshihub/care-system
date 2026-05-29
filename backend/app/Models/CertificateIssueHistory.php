<?php

namespace App\Models;

use Database\Factories\CertificateIssueHistoryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * 証発行履歴。
 *
 * 被保険者証などの証類を「誰に・いつ・どの理由で発行したか」を1件ずつ残す履歴。
 * 新規交付も再交付も発行のたびに1行積み上がり、いま手元にある有効な証を
 * is_latest=true で表す。PDFの実体は持たず保存場所 (pdf_path) のみ記録する。
 */
#[Fillable([
    'insured_person_id',
    'form_id',
    'certificate_type',
    'application_type_code',
    'application_status_code',
    'issue_status_code',
    'issue_reason_code',
    'decision_date',
    'issue_date',
    'expiry_date',
    'returned_at',
    'pdf_path',
    'is_latest',
])]
class CertificateIssueHistory extends Model
{
    /** @use HasFactory<CertificateIssueHistoryFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'insured_person_id' => 'integer',
            'decision_date' => 'date',
            'issue_date' => 'date',
            'expiry_date' => 'date',
            'returned_at' => 'datetime',
            'is_latest' => 'boolean',
        ];
    }

    /**
     * この発行履歴が属する被保険者。
     *
     * @return BelongsTo<InsuredPerson, $this>
     */
    public function insuredPerson(): BelongsTo
    {
        return $this->belongsTo(InsuredPerson::class);
    }
}
