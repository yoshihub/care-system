<?php

namespace Database\Factories;

use App\Models\CertificateIssueHistory;
use App\Models\InsuredPerson;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * 証発行履歴 Factory (CertificateIssueHistoryFactory)。
 *
 * このファイルは何か:
 *   CertificateIssueHistory モデル向けのテスト/Seeder 用ダミーデータ生成器。
 *   証種別・発行理由・発行日等をランダムに埋める。
 *
 * どう使われるか:
 *   - DemoSeeder が被保険者に発行済み被保険者証 (is_latest=true) を付与する。
 *   - 被保険者詳細の証発行履歴タブ表示を確認する。
 *
 * 設計メモ:
 *   - 親 insured_person_id 未指定時は InsuredPerson を自動作成する。
 *   - issued / reissued 等の state で application_type_code を切り替える。
 *
 * @extends Factory<CertificateIssueHistory>
 */
class CertificateIssueHistoryFactory extends Factory
{
    protected $model = CertificateIssueHistory::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $issue = fake()->dateTimeBetween('-1 year', 'now');

        return [
            'insured_person_id' => InsuredPerson::factory(),
            'form_id' => '0230010',
            'certificate_type' => 'INSURED_CARD',
            'application_type_code' => 'NEW',
            'application_status_code' => 'DECIDED',
            'issue_status_code' => 'ISSUED',
            'issue_reason_code' => '01',
            'decision_date' => $issue->format('Y-m-d'),
            'issue_date' => $issue->format('Y-m-d'),
            'expiry_date' => (clone $issue)->modify('+3 years')->format('Y-m-d'),
            'returned_at' => null,
            'pdf_path' => null,
            'is_latest' => true,
        ];
    }

    /**
     * 新規交付の証 (発行済)。
     */
    public function issued(): static
    {
        return $this->state(fn (array $attributes) => [
            'application_type_code' => 'NEW',
            'issue_status_code' => 'ISSUED',
            'is_latest' => true,
        ]);
    }

    /**
     * 再交付の証。
     */
    public function reissued(): static
    {
        return $this->state(fn (array $attributes) => [
            'application_type_code' => 'REISSUE',
            'issue_status_code' => 'ISSUED',
            'issue_reason_code' => '21',
            'is_latest' => true,
        ]);
    }
}
