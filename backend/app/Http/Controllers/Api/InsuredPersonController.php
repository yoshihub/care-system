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
     * クエリ:
     * - q (氏名・カナ・被保険者番号・住民番号の部分一致)
     * - status (資格状態の完全一致)
     * - insured_no (被保険者番号の部分一致)
     * - resident_no (住民番号の部分一致)
     * - name (氏名の部分一致。008_01 互換)
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = InsuredPerson::query();

        if ($request->filled('q')) {
            $term = $request->query('q');
            $query->where(function ($builder) use ($term) {
                $builder
                    ->where('name', 'like', '%'.$term.'%')
                    ->orWhere('kana', 'like', '%'.$term.'%')
                    ->orWhere('insured_no', 'like', '%'.$term.'%')
                    ->orWhere('resident_no', 'like', '%'.$term.'%');
            });
        }

        if ($request->filled('name')) {
            $query->where('name', 'like', '%'.$request->query('name').'%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('insured_no')) {
            $query->where('insured_no', 'like', '%'.$request->query('insured_no').'%');
        }

        if ($request->filled('resident_no')) {
            $query->where('resident_no', 'like', '%'.$request->query('resident_no').'%');
        }

        $persons = $query
            ->orderByDesc('id')
            ->get();

        return InsuredPersonResource::collection($persons)
            ->additional(['meta' => ['message' => 'ok']]);
    }
}
