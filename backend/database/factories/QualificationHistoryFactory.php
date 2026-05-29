<?php

namespace Database\Factories;

use App\Models\InsuredPerson;
use App\Models\QualificationHistory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * 資格履歴のテスト/Seeder用ダミーデータ生成。
 *
 * 既定では「資格取得 (ACQUIRE)・最新 (is_latest=true)」の履歴を作る。
 * 親の被保険者が指定されなければ新たに1人作る。喪失履歴は state で切り替える。
 *
 * @extends Factory<QualificationHistory>
 */
class QualificationHistoryFactory extends Factory
{
    protected $model = QualificationHistory::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $date = fake()->dateTimeBetween('-2 years', 'now');

        return [
            'insured_person_id' => InsuredPerson::factory(),
            'source_event_id' => null,
            'change_type' => 'ACQUIRE',
            'qualification_reason_code' => '01',
            'insured_type_code' => '1',
            'qualification_date' => $date->format('Y-m-d'),
            'notification_date' => $date->format('Y-m-d'),
            'qualification_start_date' => $date->format('Y-m-d'),
            'qualification_end_date' => null,
            'is_latest' => true,
            'memo' => null,
        ];
    }

    /**
     * 資格取得の履歴。
     */
    public function acquire(): static
    {
        return $this->state(fn (array $attributes) => [
            'change_type' => 'ACQUIRE',
            'qualification_end_date' => null,
        ]);
    }

    /**
     * 資格喪失の履歴。
     */
    public function lose(): static
    {
        return $this->state(fn (array $attributes) => [
            'change_type' => 'LOSE',
            'qualification_end_date' => now()->format('Y-m-d'),
        ]);
    }
}
