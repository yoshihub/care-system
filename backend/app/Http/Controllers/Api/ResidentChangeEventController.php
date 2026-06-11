<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreResidentChangeEventRequest;
use App\Http\Resources\ResidentChangeEventResource;
use App\Models\ResidentChangeEvent;
use App\Services\ResidentChangeImportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * 住民異動イベント API。
 *
 * 住民記録側で発生した「転入・転出・死亡・住所変更・氏名変更・65歳到達」などの出来事を
 * PoC用に取り込み、担当者が一覧で確認するための入口。
 */
class ResidentChangeEventController extends Controller
{
    /**
     * 住民異動イベント一覧。
     *
     * クエリ: status (process_status), event_type, name (部分一致), resident_no (部分一致)
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = ResidentChangeEvent::query();

        if ($request->filled('status')) {
            $query->where('process_status', $request->query('status'));
        }

        if ($request->filled('event_type')) {
            $query->where('event_type', $request->query('event_type'));
        }

        if ($request->filled('name')) {
            $query->where('name', 'like', '%'.$request->query('name').'%');
        }

        if ($request->filled('resident_no')) {
            $query->where('resident_no', 'like', '%'.$request->query('resident_no').'%');
        }

        $events = $query
            ->orderByDesc('event_date')
            ->orderByDesc('id')
            ->get();

        return ResidentChangeEventResource::collection($events)
            ->additional(['meta' => ['message' => 'ok']]);
    }

    /**
     * 住民異動イベントを手入力で登録する。
     * 登録直後は未処理（pending）とし、資格登録は別処理で行う。
     */
    public function store(StoreResidentChangeEventRequest $request): JsonResponse
    {
        $input = $request->validated();

        $event = ResidentChangeEvent::create([
            'event_uid' => $input['event_uid'],
            'municipality_code' => $input['municipality_code'],
            'resident_no' => $input['resident_no'],
            'event_type' => $input['event_type'],
            'event_date' => $input['event_date'],
            'qualification_reason_code' => $input['qualification_reason_code'] ?? null,
            'name' => $input['name'],
            'kana' => $input['kana'] ?? null,
            'birth_date' => $input['birth_date'],
            'gender_code' => $input['gender_code'] ?? null,
            'postal_code' => $input['postal_code'] ?? null,
            'pref_name' => $input['pref_name'] ?? null,
            'city_name' => $input['city_name'] ?? null,
            'town_name' => $input['town_name'] ?? null,
            'addr_line' => $input['addr_line'] ?? null,
            'addr_building' => $input['addr_building'] ?? null,
            'care_application_in_progress' => $input['care_application_in_progress'] ?? false,
            'source_type' => 'manual',
            'process_status' => 'pending',
        ]);

        return (new ResidentChangeEventResource($event))
            ->additional(['meta' => ['message' => 'ok']])
            ->response()
            ->setStatusCode(201);
    }

    /**
     * CSVファイルを取り込む。
     */
    public function import(Request $request, ResidentChangeImportService $importService): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'max:2048'],
        ]);

        $uploaded = $request->file('file');
        $csvContent = file_get_contents($uploaded->getRealPath());
        if ($csvContent === false) {
            return response()->json([
                'message' => 'CSVファイルの読み込みに失敗しました。',
            ], 400);
        }

        $fileName = $uploaded->getClientOriginalName();
        $result = $importService->import($csvContent, $fileName);

        $status = $result['ok'] ? 200 : 422;

        return response()->json([
            'data' => $result,
            'meta' => ['message' => $result['ok'] ? 'ok' : 'validation_failed'],
        ], $status);
    }
}
