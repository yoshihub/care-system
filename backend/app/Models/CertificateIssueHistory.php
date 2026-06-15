<?php

namespace App\Models;

use Database\Factories\CertificateIssueHistoryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * 証発行履歴 Eloquent モデル (certificate_issue_histories)。
 *
 * このファイルは何か:
 *   被保険者証などの証類を「誰に・いつ・どの理由で発行したか」を1件ずつ残す
 *   履歴テーブルへの ORM マッピング。
 *
 * どう使われるか:
 *   - 被保険者詳細画面の「証発行履歴」タブで一覧表示する (参照のみ、PoC では登録 API 未実装)。
 *   - 将来の証交付・再交付フロー (FLOW-02-02) で新規行が追加される想定。
 *
 * 設計メモ:
 *   - 新規交付も再交付も発行のたびに1行積み上がり、is_latest=true が有効な証を表す。
 *   - PDF 実体は持たず pdf_path のみ記録する (ストレージ連携は PoC 外)。
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
