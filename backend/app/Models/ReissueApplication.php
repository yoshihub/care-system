<?php

namespace App\Models;

use Database\Factories\ReissueApplicationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * 再交付申請 Eloquent モデル (reissue_applications)。
 *
 * このファイルは何か:
 *   被保険者証などを紛失・破損したときに受け付ける再交付申請を1件ずつ残す
 *   テーブルへの ORM マッピング。
 *
 * どう使われるか:
 *   - 被保険者詳細画面の「再交付申請」タブで一覧表示する (参照のみ、PoC では登録 API 未実装)。
 *   - 将来の再交付申請フォーム (FLOW-02-02) からレコードが作成される想定。
 *
 * 設計メモ:
 *   - 申請内容・申請者情報・古い証の返還状況を1行にまとめる。
 *   - 再発行完了後は reissued_issue_history_id で証発行履歴と紐づける。
 */
#[Fillable([
    'insured_person_id',
    'certificate_type',
    'application_date',
    'application_reason_code',
    'application_status_code',
    'applicant_name',
    'applicant_relationship_code',
    'applicant_phone',
    'return_status_code',
    'return_date',
    'approval_date',
    'reissued_issue_history_id',
    'remarks',
])]
class ReissueApplication extends Model
{
    /** @use HasFactory<ReissueApplicationFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'insured_person_id' => 'integer',
            'application_date' => 'date',
            'return_date' => 'date',
            'approval_date' => 'date',
            'reissued_issue_history_id' => 'integer',
        ];
    }

    /**
     * この再交付申請が属する被保険者。
     *
     * @return BelongsTo<InsuredPerson, $this>
     */
    public function insuredPerson(): BelongsTo
    {
        return $this->belongsTo(InsuredPerson::class);
    }

    /**
     * この申請にもとづいて再発行された証発行履歴 (再発行前は無いため任意)。
     *
     * @return BelongsTo<CertificateIssueHistory, $this>
     */
    public function reissuedIssueHistory(): BelongsTo
    {
        return $this->belongsTo(CertificateIssueHistory::class, 'reissued_issue_history_id');
    }
}
