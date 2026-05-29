<?php

namespace Database\Factories;

use App\Models\InsuredPerson;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * 被保険者のテスト/Seeder用ダミーデータ生成。
 *
 * 既定では「第1号・資格有効 (active)」の被保険者を作る。
 * 喪失済みなど、デモで使いたい状況は state で切り替える。
 *
 * @extends Factory<InsuredPerson>
 */
class InsuredPersonFactory extends Factory
{
    protected $model = InsuredPerson::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $start = fake()->dateTimeBetween('-2 years', 'now');

        return [
            'municipality_code' => '131016',
            'insurer_no' => '131016',
            'resident_no' => 'R'.fake()->unique()->numerify('########'),
            'insured_no' => fake()->unique()->numerify('##########'),
            'name' => fake('ja_JP')->lastName().' '.fake('ja_JP')->firstName(),
            'kana' => fake('ja_JP')->lastKanaName().' '.fake('ja_JP')->firstKanaName(),
            'birth_date' => fake()->dateTimeBetween('-90 years', '-65 years')->format('Y-m-d'),
            'gender_code' => fake()->randomElement(['1', '2']),
            'postal_code' => fake()->numerify('###-####'),
            'pref_name' => '東京都',
            'city_name' => '豊島区',
            'town_name' => fake('ja_JP')->streetName(),
            'addr_line' => fake()->numerify('#-#-#'),
            'addr_building' => null,
            'insured_type_code' => '1',
            'status' => 'active',
            'latest_qualification_date' => $start->format('Y-m-d'),
            'qualification_start_date' => $start->format('Y-m-d'),
            'qualification_end_date' => null,
            'current_certificate_status_code' => null,
            'care_application_in_progress' => false,
            'notes' => null,
        ];
    }

    /**
     * 資格有効 (active) の被保険者。
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
            'qualification_end_date' => null,
        ]);
    }

    /**
     * 資格喪失済み (lost) の被保険者。
     */
    public function lost(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'lost',
            'qualification_end_date' => now()->format('Y-m-d'),
        ]);
    }
}
