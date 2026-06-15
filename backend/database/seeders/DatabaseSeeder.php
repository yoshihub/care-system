<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

/**
 * アプリケーション DB シーダー入口 (DatabaseSeeder)。
 *
 * このファイルは何か:
 *   `php artisan db:seed` 実行時に呼ばれるルート Seeder。
 *   Laravel 標準の User と、介護 PoC 用 DemoSeeder を順に投入する。
 *
 * どう使われるか:
 *   - migrate:fresh --seed や db:seed で初期データを一括投入する。
 *   - DemoSeeder がシナリオA/B のデモデータ (住民異動・被保険者等) を作成する。
 *
 * 設計メモ:
 *   - WithoutModelEvents で Seeder 中の Eloquent イベントを抑制する。
 *   - 本番環境では User 以外は投入しない運用を想定 (PoC 限定)。
 */
class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // 介護保険デモ用の初期データ (住民異動イベント / 被保険者 / 証発行 / 再交付申請)。
        $this->call(DemoSeeder::class);
    }
}
