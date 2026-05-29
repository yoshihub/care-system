<?php

namespace Database\Factories;

use App\Models\ResidentChangeEvent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * 住民異動イベントのテスト/Seeder用ダミーデータ生成。
 *
 * 既定では「65歳到達・未処理 (pending)」のイベントを作る。
 * 転入・処理済み・エラーなど、デモで使いたい状況は state で切り替える。
 *
 * @extends Factory<ResidentChangeEvent>
 */
class ResidentChangeEventFactory extends Factory
{
    protected $model = ResidentChangeEvent::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'event_uid' => 'EVT-'.fake()->unique()->numerify('############'),
            'municipality_code' => '131016',
            'resident_no' => 'R'.fake()->unique()->numerify('########'),
            'event_type' => 'AGE_65',
            'event_date' => fake()->dateTimeBetween('-3 months', 'now')->format('Y-m-d'),
            'qualification_reason_code' => '01',
            'name' => fake('ja_JP')->lastName().' '.fake('ja_JP')->firstName(),
            'kana' => fake('ja_JP')->lastKanaName().' '.fake('ja_JP')->firstKanaName(),
            // 65歳前後の生年月日。65歳到達イベントの既定に合わせる。
            'birth_date' => fake()->dateTimeBetween('-66 years', '-65 years')->format('Y-m-d'),
            'gender_code' => fake()->randomElement(['1', '2']),
            'postal_code' => fake()->numerify('###-####'),
            'pref_name' => '東京都',
            'city_name' => '豊島区',
            'town_name' => fake('ja_JP')->streetName(),
            'addr_line' => fake()->numerify('#-#-#'),
            'addr_building' => null,
            'care_application_in_progress' => false,
            'source_type' => 'manual',
            'import_file_name' => null,
            'row_no' => null,
            'process_status' => 'pending',
            'processed_at' => null,
            'error_message' => null,
        ];
    }

    /**
     * 65歳到達イベント (未処理)。
     */
    public function age65(): static
    {
        return $this->state(fn (array $attributes) => [
            'event_type' => 'AGE_65',
            'qualification_reason_code' => '01',
            'birth_date' => fake()->dateTimeBetween('-66 years', '-65 years')->format('Y-m-d'),
        ]);
    }

    /**
     * 転入イベント。
     */
    public function moveIn(): static
    {
        return $this->state(fn (array $attributes) => [
            'event_type' => 'MOVE_IN',
            'qualification_reason_code' => '02',
        ]);
    }

    /**
     * 処理済み (資格登録完了) のイベント。
     */
    public function processed(): static
    {
        return $this->state(fn (array $attributes) => [
            'process_status' => 'processed',
            'processed_at' => now(),
        ]);
    }

    /**
     * 処理時にエラーが出たイベント。
     */
    public function error(): static
    {
        return $this->state(fn (array $attributes) => [
            'process_status' => 'error',
            'processed_at' => now(),
            'error_message' => '資格登録に失敗しました (デモ用ダミー)',
        ]);
    }
}
