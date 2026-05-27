<?php

use Illuminate\Support\Facades\Route;

Route::get('/api/health', function () {
    return response()->json([
        'status' => 'ok',
        'app' => config('app.name'),
        'backend' => 'Laravel',
    ]);
});
