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
 * 資格履歴 API。
 *
 * 住民異動イベントをもとに資格登録を行う入口。
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
