<?php

namespace Database\Factories;

use App\Models\InsuredPerson;
use App\Models\ReissueApplication;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * 再交付申請のテスト/Seeder用ダミーデータ生成。
 *
 * 既定では「紛失による再交付・受付済・未返還」の申請を作る。
 * 親の被保険者が指定されなければ新たに1人作る。承認済みは state で切り替える。
 *
 * @extends Factory<ReissueApplication>
 */
class ReissueApplicationFactory extends Factory
{
    protected $model = ReissueApplication::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'insured_person_id' => InsuredPerson::factory(),
            'certificate_type' => 'INSURED_CARD',
            'application_date' => fake()->dateTimeBetween('-1 month', 'now')->format('Y-m-d'),
            // 紛失 (LOST) を既定の申請理由にする。
            'application_reason_code' => 'LOST',
            'application_status_code' => 'RECEIVED',
            'applicant_name' => fake('ja_JP')->lastName().' '.fake('ja_JP')->firstName(),
            'applicant_relationship_code' => '01',
            'applicant_phone' => fake()->numerify('0##-####-####'),
            // return_status_code は8文字までのコード。NONE=未返還 / RETURNED=返還済。
            'return_status_code' => 'NONE',
            'return_date' => null,
            'approval_date' => null,
            'reissued_issue_history_id' => null,
            'remarks' => null,
        ];
    }

    /**
     * 受付済み・未処理の申請。
     */
    public function received(): static
    {
        return $this->state(fn (array $attributes) => [
            'application_status_code' => 'RECEIVED',
            'approval_date' => null,
            'reissued_issue_history_id' => null,
        ]);
    }

    /**
     * 承認済みの申請。
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'application_status_code' => 'APPROVED',
            'approval_date' => now()->format('Y-m-d'),
        ]);
    }
}
