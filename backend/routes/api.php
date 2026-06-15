<?php

use App\Http\Controllers\Api\InsuredPersonController;
use App\Http\Controllers\Api\QualificationHistoryController;
use App\Http\Controllers\Api\ResidentChangeEventController;
use Illuminate\Support\Facades\Route;

/**
 * Laravel API ルート定義。
 *
 * このファイルは何か:
 *   PoC 対象業務 (住民異動取込・資格登録・被保険者照会) の HTTP エンドポイントを
 *   Controller へ振り分けるルーティング表。
 *
 * どう使われるか:
 *   - bootstrap/app.php 経由で api ミドルウェアグループに読み込まれる。
 *   - ここに書いたパスには自動で /api プレフィックスが付く (例: /health → /api/health)。
 *   - ブラウザからは直接呼ばず、Next.js BFF (backendFetch) 経由で呼ばれる。
 *
 * 設計メモ:
 *   - api グループはステートレス (セッション/CSRF なし)。
 *   - 認証・認可は PoC では未実装。
 */

// ---- 疎通確認 ----------------------------------------------------------

// 開発用 health チェック。Next.js BFF の接続確認がこのルートを叩く。
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'app' => config('app.name'),
        'backend' => 'Laravel',
    ]);
});

// ---- 02-01 住民情報異動等に伴う資格異動 -------------------------------

// 住民異動イベント一覧 (未処理/処理済み/エラーの状況確認)
Route::get('/resident-change-events', [ResidentChangeEventController::class, 'index']);
// 住民異動イベント手入力登録 (登録直後は pending)
Route::post('/resident-change-events', [ResidentChangeEventController::class, 'store']);
// 住民異動イベント CSV 取込
Route::post('/resident-change-events/import', [ResidentChangeEventController::class, 'import']);

// 資格登録 (住民異動イベントをもとに被保険者・資格履歴を作成/更新)
Route::post('/qualification-histories', [QualificationHistoryController::class, 'store']);

// ---- 被保険者照会 ------------------------------------------------------

// 被保険者一覧 (資格情報照会・検索)
Route::get('/insured-persons', [InsuredPersonController::class, 'index']);
// 被保険者詳細 (基本情報・各種履歴)
Route::get('/insured-persons/{id}', [InsuredPersonController::class, 'show']);
