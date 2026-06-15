<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreQualificationHistoryRequest;
use App\Http\Resources\InsuredPersonResource;
use App\Http\Resources\QualificationHistoryResource;
use App\Http\Resources\ResidentChangeEventResource;
use App\Services\QualificationRegistrationService;
use Illuminate\Http\JsonResponse;
use InvalidArgumentException;

/**
 * 資格履歴 API コントローラ。
 *
 * このファイルは何か:
 *   住民異動イベントをもとに資格登録を実行する API の入口。
 *   HTTP 層では入力検証とレスポンス整形のみを行い、業務ロジックは Service に委譲する。
 *
 * どう使われるか:
 *   - POST /api/qualification-histories で資格登録画面から呼ばれる。
 *   - 成功時は作成された資格履歴に加え、更新後の被保険者・処理済みイベントも返す。
 *
 * 設計メモ:
 *   - 業務ルール違反 (未処理イベントでない、被保険者重複など) は
 *     InvalidArgumentException を 422 + BUSINESS_RULE_001 で返す。
 */
class QualificationHistoryController extends Controller
{
    /**
     * 資格登録を実行する。
     */
    public function store(
        StoreQualificationHistoryRequest $request,
        QualificationRegistrationService $registrationService,
    ): JsonResponse {
        try {
            $result = $registrationService->register($request->validated());
        } catch (InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'code' => 'BUSINESS_RULE_001',
            ], 422);
        }

        return (new QualificationHistoryResource($result['qualification_history']))
            ->additional([
                'meta' => ['message' => 'ok'],
                'insured_person' => new InsuredPersonResource($result['insured_person']),
                'source_event' => new ResidentChangeEventResource($result['source_event']),
            ])
            ->response()
            ->setStatusCode(201);
    }
}
