<?php

namespace Database\Factories;

use App\Models\InsuredPerson;
use App\Models\ReissueApplication;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * 再交付申請 Factory (ReissueApplicationFactory)。
 *
 * このファイルは何か:
 *   ReissueApplication モデル向けのテスト/Seeder 用ダミーデータ生成器。
 *   申請理由・申請者・返還状況等をランダムに埋める。
 *
 * どう使われるか:
 *   - DemoSeeder が主役被保険者に受付済 (received) の再交付申請を1件作成する。
 *   - 再交付申請・再発行の実装時のテストデータとして利用する。
 *
 * 設計メモ:
 *   - 親 insured_person_id 未指定時は InsuredPerson を自動作成する。
 *   - received / approved 等の state で application_status_code を切り替える。
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
