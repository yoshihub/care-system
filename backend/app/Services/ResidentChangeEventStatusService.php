<?php

namespace App\Services;

use App\Models\ResidentChangeEvent;
use InvalidArgumentException;

/**
 * 住民異動イベントの処理状態管理。
 *
 * このファイルは何か:
 *   resident_change_events.process_status と processed_at・error_message を
 *   更新するだけの薄いサービス。資格登録そのものは行わない。
 *
 * どう使われるか:
 *   - QualificationRegistrationService が正常終了時に markAsProcessed() を呼ぶ。
 *   - 将来、資格登録失敗時に markAsError() でエラー理由を残す想定。
 *   - markAsPending() は再試行用。PoC では必要になったときだけ使う。
 *
 * 設計メモ:
 *   - 状態遷移のルール (pending / processed / error) をここに集約し、
 *     Controller や他 Service から直接カラムを書き換えない。
 */
class ResidentChangeEventStatusService
{
    /**
     * 処理済みにする（資格登録が正常終了したときなど）。
     *
     * - process_status → processed
     * - processed_at → 現在日時
     * - error_message → クリア
     */
    public function markAsProcessed(ResidentChangeEvent $event): ResidentChangeEvent
    {
        $event->process_status = ResidentChangeEvent::STATUS_PROCESSED;
        $event->processed_at = now();
        $event->error_message = null;
        $event->save();

        return $event->refresh();
    }

    /**
     * エラー状態にする（資格登録失敗など）。
     *
     * - process_status → error
     * - processed_at → 現在日時
     * - error_message → 渡された理由
     */
    public function markAsError(ResidentChangeEvent $event, string $errorMessage): ResidentChangeEvent
    {
        $message = trim($errorMessage);
        if ($message === '') {
            throw new InvalidArgumentException('エラー理由は空にできません。');
        }

        $event->process_status = ResidentChangeEvent::STATUS_ERROR;
        $event->processed_at = now();
        $event->error_message = $message;
        $event->save();

        return $event->refresh();
    }

    /**
     * 未処理に戻す（再試行用。PoCでは必要になったときだけ使う）。
     *
     * - process_status → pending
     * - processed_at → クリア
     * - error_message → クリア
     */
    public function markAsPending(ResidentChangeEvent $event): ResidentChangeEvent
    {
        $event->process_status = ResidentChangeEvent::STATUS_PENDING;
        $event->processed_at = null;
        $event->error_message = null;
        $event->save();

        return $event->refresh();
    }
}
