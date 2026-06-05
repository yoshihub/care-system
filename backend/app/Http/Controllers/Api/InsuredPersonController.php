<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\InsuredPersonResource;
use App\Models\InsuredPerson;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * 被保険者 API。
 *
 * 資格情報の照会・一覧確認の入口。PoCでは登録は資格登録タスク側で行う。
 */
class InsuredPersonController extends Controller
{
    /**
     * 被保険者一覧。
     *
     * クエリ: name (氏名の部分一致), status (資格状態の完全一致)
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = InsuredPerson::query();

        if ($request->filled('name')) {
            $query->where('name', 'like', '%'.$request->query('name').'%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        $persons = $query
            ->orderByDesc('id')
            ->get();

        return InsuredPersonResource::collection($persons)
            ->additional(['meta' => ['message' => 'ok']]);
    }
}
