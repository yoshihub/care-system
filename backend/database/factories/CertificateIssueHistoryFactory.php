<?php

namespace Database\Factories;

use App\Models\CertificateIssueHistory;
use App\Models\InsuredPerson;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * 証発行履歴のテスト/Seeder用ダミーデータ生成。
 *
 * 既定では「被保険者証を新規交付・発行済・最新 (is_latest=true)」の履歴を作る。
 * 親の被保険者が指定されなければ新たに1人作る。再交付分は state で切り替える。
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
