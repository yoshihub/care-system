<?php

use Illuminate\Support\Facades\Route;

/*
 * API ルート。
 *
 * ここに定義したルートには自動的に /api プレフィックスが付き、
 * ステートレス (セッション/CSRFなし) な api ミドルウェアグループが適用される。
 * ブラウザからは直接呼ばず、Next.js BFF (Route Handler) 経由で呼ばれる。
 */

// 開発用の疎通確認。Next.js BFF の health チェックがこのルートを叩く。
// 自動で /api が付くため、ここでは /health と書く (実URLは /api/health)。
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'app' => config('app.name'),
        'backend' => 'Laravel',
    ]);
});
