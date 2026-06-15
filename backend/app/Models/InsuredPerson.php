<?php

namespace App\Models;

use Database\Factories\InsuredPersonFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * 被保険者 Eloquent モデル (insured_persons)。
 *
 * このファイルは何か:
 *   介護保険の資格を持つ人、またはこれから持つ候補となる人の基本情報と、
 *   いま現在の資格状態を1行で表す本体テーブルへの ORM マッピング。
 *
 * どう使われるか:
 *   - 資格登録 (ACQUIRE 等) で新規作成、または CHANGE / LOSE 等で更新される。
 *   - 被保険者一覧・詳細 API、資格登録後の参照で InsuredPersonController から利用される。
 *   - 資格の変遷そのものは QualificationHistory に積み、ここは「最新スナップショット」を持つ。
 *
 * 設計メモ:
 *   - 1人1行。履歴は qualificationHistories / certificateIssueHistories 等の関連で参照する。
 *   - Laravel の複数形推測では insured_people になるため、$table を明示している。
 */
#[Fillable([
    'municipality_code',
    'insurer_no',
    'resident_no',
    'insured_no',
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
    'insured_type_code',
    'status',
    'latest_qualification_date',
    'qualification_start_date',
    'qualification_end_date',
    'current_certificate_status_code',
    'care_application_in_progress',
    'notes',
])]
class InsuredPerson extends Model
{
    /** @use HasFactory<InsuredPersonFactory> */
    use HasFactory;

    // Laravel の複数形推測では insured_people になってしまうため、実テーブル名を明示する。
    protected $table = 'insured_persons';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'latest_qualification_date' => 'date',
            'qualification_start_date' => 'date',
            'qualification_end_date' => 'date',
            'care_application_in_progress' => 'boolean',
        ];
    }

    /**
     * この被保険者の資格履歴 (取得・変更・喪失などの変遷)。
     *
     * @return HasMany<QualificationHistory, $this>
     */
    public function qualificationHistories(): HasMany
    {
        return $this->hasMany(QualificationHistory::class);
    }

    /**
     * この被保険者の証発行履歴 (新規交付・再交付)。
     *
     * @return HasMany<CertificateIssueHistory, $this>
     */
    public function certificateIssueHistories(): HasMany
    {
        return $this->hasMany(CertificateIssueHistory::class);
    }

    /**
     * この被保険者の再交付申請。
     *
     * @return HasMany<ReissueApplication, $this>
     */
    public function reissueApplications(): HasMany
    {
        return $this->hasMany(ReissueApplication::class);
    }
}
