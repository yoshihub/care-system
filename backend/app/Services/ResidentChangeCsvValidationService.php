<?php

namespace App\Services;

use App\Models\ResidentChangeEvent;
use DateTime;

/**
 * 住民異動イベント CSV の検証。
 *
 * このファイルは何か:
 *   CSV 取込の前段で、ヘッダ形式・必須項目・日付・異動種別・イベント ID 重複を
 *   チェックする専用クラス。DB への書き込みは行わない。
 *
 * どう使われるか:
 *   - ResidentChangeImportService が import() の冒頭で validate() を呼ぶ。
 *   - ok=false のときは行エラー内容を API レスポンスとして返し、登録は行わない。
 *
 * 設計メモ:
 *   - ヘッダが仕様と異なる場合は列対応が崩れるため、行チェックはスキップする。
 *   - event_uid の重複は「CSV 内」と「既存 DB」の両方を見る。
 *   - note 列は CSV 上の備考欄で、DB には保存しない。
 */
class ResidentChangeCsvValidationService
{
    /**
     * CSVの1行目に並ぶべき列名（この順番で並んでいる必要がある）。
     *
     * note はCSV上の備考欄。DBには保存しない。
     *
     * @var array<int, string>
     */
    private const EXPECTED_HEADER = [
        'event_uid',
        'municipality_code',
        'resident_no',
        'event_type',
        'event_date',
        'qualification_reason_code',
        'name',
        'kana',
        'birth_date',
        'gender_code',
        'postal_code',
        'pref_name',
        'city_name',
        'town_name',
        'addr_line',
        'addr_building',
        'care_application_in_progress',
        'note',
    ];

    /**
     * 取り込みを許可する異動種別。
     * それ以外の値が入っていたらエラーにする。
     *
     * @var array<int, string>
     */
    private const EVENT_TYPES = [
        'AGE_65',         // 65歳到達
        'MOVE_IN',        // 転入
        'MOVE_OUT',       // 転出
        'DEATH',          // 死亡
        'ADDRESS_CHANGE', // 住所変更
        'NAME_CHANGE',    // 氏名変更
    ];

    /**
     * CSV全体を検証する（メインの入口）。
     *
     * @param array<int, string> $header CSV 1行目（fgetcsv の結果）
     * @param array<int, array<int, string|null>> $rows CSV 2行目以降
     * @return array{
     *   ok: bool,
     *   header_errors: array<int, string>,
     *   row_errors: array<int, array{row: int, field: string, message: string}>
     * }
     */
    public function validate(array $header, array $rows): array
    {
        // ステップ1: ヘッダ行をチェック
        $headerErrors = $this->validateHeader($header);
        $rowErrors = [];

        // ヘッダが違うと、列の対応関係が崩れるので行チェックはしない
        if (count($headerErrors) > 0) {
            return [
                'ok' => false,
                'header_errors' => $headerErrors,
                'row_errors' => [],
            ];
        }

        // ステップ2: 重複チェック用に、全行の event_uid を先に集める
        // （1行ずつ見るより、先にまとめて調べた方が効率的）
        $eventUids = $this->collectColumnValues($rows, 0);
        $duplicatedInCsv = $this->findDuplicatedValues($eventUids);
        $alreadyExists = $this->findExistingEventUids($eventUids);

        // ステップ3: データ行を1行ずつチェック
        foreach ($rows as $index => $row) {
            // CSV上の行番号（1行目=ヘッダ、2行目=データ1件目）
            $rowNo = $index + 2;

            // 配列 [値0, 値1, ...] を ['event_uid' => 値0, ...] の形に変換
            $data = $this->rowToAssoc($row);

            // --- 必須項目 ---
            $this->require($rowErrors, $rowNo, $data, 'event_uid', 'イベントIDは必須です。');
            $this->require($rowErrors, $rowNo, $data, 'municipality_code', '自治体コードは必須です。');
            $this->require($rowErrors, $rowNo, $data, 'resident_no', '住民番号は必須です。');
            $this->require($rowErrors, $rowNo, $data, 'event_type', '異動種別は必須です。');
            $this->require($rowErrors, $rowNo, $data, 'event_date', '異動日は必須です。');
            $this->require($rowErrors, $rowNo, $data, 'name', '氏名は必須です。');

            // --- 異動種別: 定義済み6種以外は不可 ---
            if ($this->hasValue($data, 'event_type') && !in_array($data['event_type'], self::EVENT_TYPES, true)) {
                $rowErrors[] = [
                    'row' => $rowNo,
                    'field' => 'event_type',
                    'message' => '異動種別の値が不正です。',
                ];
            }

            // --- 日付形式: YYYY-MM-DD のみ許可 ---
            if ($this->hasValue($data, 'event_date') && !$this->isValidDate($data['event_date'])) {
                $rowErrors[] = [
                    'row' => $rowNo,
                    'field' => 'event_date',
                    'message' => '異動日は日付（YYYY-MM-DD）で指定してください。',
                ];
            }

            // 生年月日は任意だが、入力されている場合は日付形式をチェック
            if ($this->hasValue($data, 'birth_date') && !$this->isValidDate($data['birth_date'])) {
                $rowErrors[] = [
                    'row' => $rowNo,
                    'field' => 'birth_date',
                    'message' => '生年月日は日付（YYYY-MM-DD）で指定してください。',
                ];
            }

            // --- イベントIDの重複 ---
            if ($this->hasValue($data, 'event_uid')) {
                $uid = $data['event_uid'];

                // 同じCSVファイル内で同じIDが2回以上出てきた
                if (in_array($uid, $duplicatedInCsv, true)) {
                    $rowErrors[] = [
                        'row' => $rowNo,
                        'field' => 'event_uid',
                        'message' => 'CSV内でイベントIDが重複しています。',
                    ];
                }

                // すでにDBに登録済みのID
                if (in_array($uid, $alreadyExists, true)) {
                    $rowErrors[] = [
                        'row' => $rowNo,
                        'field' => 'event_uid',
                        'message' => '同じイベントIDは既に登録されています。',
                    ];
                }
            }
        }

        // 行エラーが1件もなければ ok = true
        return [
            'ok' => count($rowErrors) === 0,
            'header_errors' => [],
            'row_errors' => $rowErrors,
        ];
    }

    /**
     * ヘッダ行が仕様どおりかチェックする。
     *
     * @param array<int, string> $header
     * @return array<int, string> エラーメッセージ（問題なければ空配列）
     */
    private function validateHeader(array $header): array
    {
        $normalized = array_map(fn ($v) => $this->normalizeHeaderValue($v), $header);

        if ($normalized === self::EXPECTED_HEADER) {
            return [];
        }

        return [
            'CSVヘッダが想定と一致しません。列名と順番を確認してください。',
        ];
    }

    /**
     * ヘッダの1セルを正規化する（前後空白・BOM除去）。
     */
    private function normalizeHeaderValue(?string $value): string
    {
        $v = $value ?? '';
        $v = trim($v);
        // Excelで保存したCSVに付くことがある BOM を除去
        $v = preg_replace('/^\xEF\xBB\xBF/', '', $v) ?? $v;

        return $v;
    }

    /**
     * 指定列の値を全行分集める（重複チェック用）。
     *
     * @param array<int, array<int, string|null>> $rows
     * @return array<int, string>
     */
    private function collectColumnValues(array $rows, int $colIndex): array
    {
        $values = [];
        foreach ($rows as $row) {
            $raw = $row[$colIndex] ?? null;
            $v = is_string($raw) ? trim($raw) : '';
            if ($v !== '') {
                $values[] = $v;
            }
        }

        return $values;
    }

    /**
     * 配列の中で2回以上出てきた値を返す（CSV内重複の検出）。
     *
     * @param array<int, string> $values
     * @return array<int, string>
     */
    private function findDuplicatedValues(array $values): array
    {
        $counts = [];
        foreach ($values as $v) {
            $counts[$v] = ($counts[$v] ?? 0) + 1;
        }

        $duplicated = [];
        foreach ($counts as $v => $count) {
            if ($count >= 2) {
                $duplicated[] = $v;
            }
        }

        return $duplicated;
    }

    /**
     * DBにすでに存在する event_uid を返す（二重取込防止）。
     *
     * @param array<int, string> $eventUids
     * @return array<int, string>
     */
    private function findExistingEventUids(array $eventUids): array
    {
        if (count($eventUids) === 0) {
            return [];
        }

        return ResidentChangeEvent::query()
            ->whereIn('event_uid', array_values(array_unique($eventUids)))
            ->pluck('event_uid')
            ->all();
    }

    /**
     * fgetcsv の1行（数値添字配列）を、列名付きの連想配列に変換する。
     *
     * 例: ['EVT-001', '131016', ...] → ['event_uid' => 'EVT-001', 'municipality_code' => '131016', ...]
     *
     * @param array<int, string|null> $row
     * @return array<string, string>
     */
    private function rowToAssoc(array $row): array
    {
        $assoc = [];
        foreach (self::EXPECTED_HEADER as $i => $key) {
            $raw = $row[$i] ?? null;
            $value = is_string($raw) ? trim($raw) : '';
            $assoc[$key] = $value;
        }

        return $assoc;
    }

    /**
     * 必須項目チェック。空なら rowErrors に追加する。
     *
     * @param array<int, array{row: int, field: string, message: string}> $rowErrors
     * @param array<string, string> $data
     */
    private function require(array &$rowErrors, int $rowNo, array $data, string $field, string $message): void
    {
        if (!$this->hasValue($data, $field)) {
            $rowErrors[] = [
                'row' => $rowNo,
                'field' => $field,
                'message' => $message,
            ];
        }
    }

    /**
     * 項目に値が入っているか（空文字・空白のみは「値なし」とみなす）。
     *
     * @param array<string, string> $data
     */
    private function hasValue(array $data, string $field): bool
    {
        if (!array_key_exists($field, $data)) {
            return false;
        }

        return trim((string) $data[$field]) !== '';
    }

    /**
     * YYYY-MM-DD 形式の日付かどうかを判定する。
     */
    private function isValidDate(string $value): bool
    {
        $dt = DateTime::createFromFormat('Y-m-d', $value);
        if ($dt === false) {
            return false;
        }

        // 2026-13-01 のような存在しない日付を弾くため、再フォーマットして一致確認
        return $dt->format('Y-m-d') === $value;
    }
}
