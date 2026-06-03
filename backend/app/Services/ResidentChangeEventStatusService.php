<?php

namespace App\Services;

use App\Models\ResidentChangeEvent;
use InvalidArgumentException;

/**
 * 住民異動イベントの処理状態を更新する。
 *
 * pending / processed / error の切り替えと、
 * processed_at・error_message の保存を担当する。
 * 資格登録の本処理は別タスク（011 など）で行う。
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
