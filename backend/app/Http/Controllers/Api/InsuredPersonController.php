<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\InsuredPersonDetailResource;
use App\Http\Resources\InsuredPersonResource;
use App\Models\InsuredPerson;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * 被保険者 API コントローラ。
 *
 * このファイルは何か:
 *   被保険者 (insured_persons) の一覧・詳細を返す読み取り専用 API の入口。
 *   被保険者の新規作成は資格登録 API 側で行うため、ここには store はない。
 *
 * どう使われるか:
 *   - Next.js BFF 経由でフロントの被保険者検索・詳細画面から呼ばれる。
 *   - index: キーワード・状態・番号などで絞り込み一覧を返す。
 *   - show: 基本情報に加え、資格履歴・証発行履歴・再交付申請を eager load して返す。
 *
 * 設計メモ:
 *   - レスポンス整形は InsuredPersonResource / InsuredPersonDetailResource に委譲する。
 *   - PoC ではページネーションは未実装。全件取得後に Resource で整形する。
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
     * - name (氏名の部分一致。一覧API初期版との互換)
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = InsuredPerson::query();

        // ---- 検索条件 (クエリパラメータ) --------------------------------

        // キーワード横断検索: 氏名・カナ・被保険者番号・住民番号のいずれかに部分一致
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

    /**
     * 被保険者詳細。
     *
     * 基本情報・資格履歴・証発行履歴・再交付申請履歴を返す。
     */
    public function show(string $id): JsonResponse|InsuredPersonDetailResource
    {
        // 詳細表示に必要な関連履歴をまとめて取得 (N+1 回避)
        $person = InsuredPerson::query()
            ->with([
                'qualificationHistories' => fn ($query) => $query
                    ->orderByDesc('qualification_date')
                    ->orderByDesc('id'),
                'certificateIssueHistories' => fn ($query) => $query
                    ->orderByDesc('issue_date')
                    ->orderByDesc('id'),
                'reissueApplications' => fn ($query) => $query
                    ->orderByDesc('application_date')
                    ->orderByDesc('id'),
            ])
            ->find($id);

        if ($person === null) {
            return response()->json([
                'message' => '被保険者が見つかりません。',
            ], 404);
        }

        return (new InsuredPersonDetailResource($person))
            ->additional(['meta' => ['message' => 'ok']]);
    }
}
