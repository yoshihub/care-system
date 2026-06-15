<?php

namespace Database\Factories;

use App\Models\InsuredPerson;
use App\Models\QualificationHistory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * 資格履歴 Factory (QualificationHistoryFactory)。
 *
 * このファイルは何か:
 *   QualificationHistory モデル向けのテスト/Seeder 用ダミーデータ生成器。
 *   異動区分・資格理由・有効期間等をランダムに埋める。
 *
 * どう使われるか:
 *   - DemoSeeder が被保険者に acquire 履歴 (is_latest=true) を付与する。
 *   - 資格登録 API のテストで履歴行を検証する。
 *
 * 設計メモ:
 *   - 親 insured_person_id 未指定時は InsuredPerson を自動作成する。
 *   - acquire / lose 等の state で change_type を切り替える。
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
