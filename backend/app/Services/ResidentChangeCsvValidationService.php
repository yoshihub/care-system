<?php

namespace App\Services;

use App\Models\ResidentChangeEvent;
use DateTime;

/**
 * 住民異動イベントCSVの検証ロジック。
 *
 * このクラスは「不正なCSVを検出する」ことだけを担当する。
 * DB登録や業務処理（資格登録など）は別タスクで実装する。
 */
class ResidentChangeCsvValidationService
{
    /**
     * CSVで期待するヘッダ（順番も含めて一致させる）。
     *
     * note はCSV上の備考欄で、DBには保存しない想定（後続タスクで扱う）。
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
     * 取り込める異動種別。
     *
     * @var array<int, string>
     */
    private const EVENT_TYPES = [
        'AGE_65',
        'MOVE_IN',
        'MOVE_OUT',
        'DEATH',
        'ADDRESS_CHANGE',
        'NAME_CHANGE',
    ];

    /**
     * CSVヘッダと行データを検証する。
     *
     * @param array<int, string> $header 1行目のヘッダ
     * @param array<int, array<int, string|null>> $rows 2行目以降のデータ（fgetcsv の配列想定）
     * @return array{ok: bool, header_errors: array<int, string>, row_errors: array<int, array{row: int, field: string, message: string}>}
     */
    public function validate(array $header, array $rows): array
    {
        $headerErrors = $this->validateHeader($header);
        $rowErrors = [];

        // ヘッダが不正な場合、行の検証は「列の対応が崩れる」のでここで止める。
        if (count($headerErrors) > 0) {
            return [
                'ok' => false,
                'header_errors' => $headerErrors,
                'row_errors' => [],
            ];
        }

        // event_uid の重複チェック（CSV内 + 既にDBにあるもの）
        $eventUids = $this->collectColumnValues($rows, 0);
        $duplicatedInCsv = $this->findDuplicatedValues($eventUids);
        $alreadyExists = $this->findExistingEventUids($eventUids);

        foreach ($rows as $index => $row) {
            // CSVの行番号は 1:ヘッダ、2〜:データ
            $rowNo = $index + 2;
            $data = $this->rowToAssoc($row);

            // 必須項目
            $this->require($rowErrors, $rowNo, $data, 'event_uid', 'イベントIDは必須です。');
            $this->require($rowErrors, $rowNo, $data, 'municipality_code', '自治体コードは必須です。');
            $this->require($rowErrors, $rowNo, $data, 'resident_no', '住民番号は必須です。');
            $this->require($rowErrors, $rowNo, $data, 'event_type', '異動種別は必須です。');
            $this->require($rowErrors, $rowNo, $data, 'event_date', '異動日は必須です。');
            $this->require($rowErrors, $rowNo, $data, 'name', '氏名は必須です。');

            // enum / 日付
            if ($this->hasValue($data, 'event_type') && !in_array($data['event_type'], self::EVENT_TYPES, true)) {
                $rowErrors[] = [
                    'row' => $rowNo,
                    'field' => 'event_type',
                    'message' => '異動種別の値が不正です。',
                ];
            }

            if ($this->hasValue($data, 'event_date') && !$this->isValidDate($data['event_date'])) {
                $rowErrors[] = [
                    'row' => $rowNo,
                    'field' => 'event_date',
                    'message' => '異動日は日付（YYYY-MM-DD）で指定してください。',
                ];
            }

            if ($this->hasValue($data, 'birth_date') && !$this->isValidDate($data['birth_date'])) {
                $rowErrors[] = [
                    'row' => $rowNo,
                    'field' => 'birth_date',
                    'message' => '生年月日は日付（YYYY-MM-DD）で指定してください。',
                ];
            }

            // event_uid の重複
            if ($this->hasValue($data, 'event_uid')) {
                $uid = $data['event_uid'];

                if (in_array($uid, $duplicatedInCsv, true)) {
                    $rowErrors[] = [
                        'row' => $rowNo,
                        'field' => 'event_uid',
                        'message' => 'CSV内でイベントIDが重複しています。',
                    ];
                }

                if (in_array($uid, $alreadyExists, true)) {
                    $rowErrors[] = [
                        'row' => $rowNo,
                        'field' => 'event_uid',
                        'message' => '同じイベントIDは既に登録されています。',
                    ];
                }
            }
        }

        return [
            'ok' => count($rowErrors) === 0,
            'header_errors' => [],
            'row_errors' => $rowErrors,
        ];
    }

    /**
     * @param array<int, string> $header
     * @return array<int, string>
     */
    private function validateHeader(array $header): array
    {
        $normalized = array_map(fn ($v) => $this->normalizeHeaderValue($v), $header);
        $expected = self::EXPECTED_HEADER;

        if ($normalized === $expected) {
            return [];
        }

        return [
            'CSVヘッダが想定と一致しません。列名と順番を確認してください。',
        ];
    }

    private function normalizeHeaderValue(?string $value): string
    {
        $v = $value ?? '';
        $v = trim($v);
        // Excel由来のBOMや不可視文字を軽く除去
        $v = preg_replace('/^\xEF\xBB\xBF/', '', $v) ?? $v;
        return $v;
    }

    /**
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
     * @param array<string, string> $data
     */
    private function hasValue(array $data, string $field): bool
    {
        if (!array_key_exists($field, $data)) {
            return false;
        }
        return trim((string) $data[$field]) !== '';
    }

    private function isValidDate(string $value): bool
    {
        $dt = DateTime::createFromFormat('Y-m-d', $value);
        if ($dt === false) {
            return false;
        }
        return $dt->format('Y-m-d') === $value;
    }
}

