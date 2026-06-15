<?php

namespace App\Services;

use App\Models\InsuredPerson;
use Illuminate\Support\Facades\DB;
use RuntimeException;

/**
 * 被保険者番号の自動採番。
 *
 * このファイルは何か:
 *   新規資格取得 (ACQUIRE) 時に insured_persons.insured_no へ付与する
 *   10桁ゼロ埋めの連番を生成するサービス。
 *
 * どう使われるか:
 *   - QualificationRegistrationService が被保険者を新規作成するときに
 *     generateNext() を 1 回だけ呼ぶ。
 *
 * 設計メモ:
 *   - PoC では全被保険者の最大値 + 1 を採用する簡易方式。
 *   - 本番相当の採番ルール (自治体別・年度別など) は実装しない。
 *   - 採番後に重複チェックを行い、異常時は RuntimeException を投げる。
 */
class InsuredNumberService
{
    private const NUMBER_LENGTH = 10;

    /**
     * 次に付与する被保険者番号を採番する。
     *
     * 既存の最大値に +1 した値を返す。レコードが無い場合は 0000000001。
     */
    public function generateNext(): string
    {
        // 数値として最大値を取得し、次番号を決める。レコードが無ければ 1 から開始。
        $max = InsuredPerson::query()
            ->max(DB::raw('CAST(insured_no AS UNSIGNED)'));

        $next = $max === null ? 1 : ((int) $max) + 1;

        // 10桁の上限を超えたら採番不能
        if ($next > 9999999999) {
            throw new RuntimeException('被保険者番号の採番上限に達しました。');
        }

        $number = str_pad((string) $next, self::NUMBER_LENGTH, '0', STR_PAD_LEFT);

        if (InsuredPerson::query()->where('insured_no', $number)->exists()) {
            throw new RuntimeException('被保険者番号の採番で重複が発生しました。');
        }

        return $number;
    }
}
