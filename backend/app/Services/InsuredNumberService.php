<?php

namespace App\Services;

use App\Models\InsuredPerson;
use Illuminate\Support\Facades\DB;
use RuntimeException;

/**
 * 被保険者番号の自動付番。
 *
 * PoC では insured_persons.insured_no の最大値 + 1 を
 * 10桁ゼロ埋めの文字列として返す。資格登録の業務処理から呼び出される。
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
        $max = InsuredPerson::query()
            ->max(DB::raw('CAST(insured_no AS UNSIGNED)'));

        $next = $max === null ? 1 : ((int) $max) + 1;

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
