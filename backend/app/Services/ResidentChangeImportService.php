<?php

namespace App\Services;

use App\Models\ResidentChangeEvent;
use Illuminate\Support\Facades\DB;

/**
 * 住民異動イベントCSVの「取込実行」クラス。
 *
 * 【このクラスの役割】
 * CSV文字列を受け取り、検証を通った行を resident_change_events テーブルに登録する。
 *
 * 【処理の流れ】
 * 1. CSV文字列をパース（ヘッダ + データ行に分割）
 * 2. ResidentChangeCsvValidationService で中身チェック
 * 3. エラーがあれば登録せず、エラー内容を返す
 * 4. 問題なければ全行をDBに登録（途中で失敗したら全部ロールバック）
 *
 * 【登録時のルール】
 * - source_type = 'csv'（手入力との区別）
 * - process_status = 'pending'（未処理。資格登録は別タスク）
 * - note 列はCSV上のみで、DBには保存しない
 *
 * 【このクラスがやらないこと】
 * - 資格登録（被保険者の作成・更新）
 * - 画面表示
 */
class ResidentChangeImportService
{
    /**
     * CSV列名（ValidationService と同じ順番）。
     * rowToAssoc() で「列の位置 → 項目名」に変換するときに使う。
     *
     * @var array<int, string>
     */
    private const CSV_COLUMNS = [
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

    public function __construct(
        private readonly ResidentChangeCsvValidationService $validationService
    ) {}

    /**
     * CSV文字列を取り込む（メインの入口）。
     *
     * @param string $csvContent CSVファイルの中身（文字列）
     * @param string $fileName   取込元ファイル名（DBの import_file_name に保存）
     * @return array{
     *   ok: bool,
     *   imported_count: int,
     *   header_errors: array<int, string>,
     *   row_errors: array<int, array{row: int, field: string, message: string}>
     * }
     */
    public function import(string $csvContent, string $fileName): array
    {
        // ステップ1: CSV文字列をヘッダ行 + データ行に分割
        $parsed = $this->parseCsv($csvContent);
        $header = $parsed['header'];
        $rows = $parsed['rows'];

        // ステップ2: 中身チェック（ValidationService に委譲）
        $validation = $this->validationService->validate($header, $rows);

        // 検証エラーがあれば、1件も登録せずエラー内容だけ返す
        if (!$validation['ok']) {
            return [
                'ok' => false,
                'imported_count' => 0,
                'header_errors' => $validation['header_errors'],
                'row_errors' => $validation['row_errors'],
            ];
        }

        // ヘッダだけでデータ行がない場合（空ファイルに近い状態）
        if (count($rows) === 0) {
            return [
                'ok' => true,
                'imported_count' => 0,
                'header_errors' => [],
                'row_errors' => [],
            ];
        }

        // ステップ3: 全行をDBに登録
        // トランザクション: 途中で1行でも失敗したら、それまでの登録を全部取り消す
        $importedCount = 0;

        DB::transaction(function () use ($rows, $fileName, &$importedCount) {
            foreach ($rows as $index => $row) {
                // CSV上の行番号（エラー表示と同じ基準）
                $rowNo = $index + 2;
                $data = $this->rowToAssoc($row);

                ResidentChangeEvent::create([
                    'event_uid' => $data['event_uid'],
                    'municipality_code' => $data['municipality_code'],
                    'resident_no' => $data['resident_no'],
                    'event_type' => $data['event_type'],
                    'event_date' => $data['event_date'],
                    'qualification_reason_code' => $this->emptyToNull($data['qualification_reason_code']),
                    'name' => $data['name'],
                    'kana' => $this->emptyToNull($data['kana']),
                    'birth_date' => $data['birth_date'] !== '' ? $data['birth_date'] : null,
                    'gender_code' => $this->emptyToNull($data['gender_code']),
                    'postal_code' => $this->emptyToNull($data['postal_code']),
                    'pref_name' => $this->emptyToNull($data['pref_name']),
                    'city_name' => $this->emptyToNull($data['city_name']),
                    'town_name' => $this->emptyToNull($data['town_name']),
                    'addr_line' => $this->emptyToNull($data['addr_line']),
                    'addr_building' => $this->emptyToNull($data['addr_building']),
                    'care_application_in_progress' => $this->parseBoolean($data['care_application_in_progress']),
                    'source_type' => 'csv',
                    'import_file_name' => $fileName,
                    'row_no' => $rowNo,
                    'process_status' => 'pending',
                ]);

                $importedCount++;
            }
        });

        return [
            'ok' => true,
            'imported_count' => $importedCount,
            'header_errors' => [],
            'row_errors' => [],
        ];
    }

    /**
     * CSV文字列をパースして、ヘッダ行とデータ行に分ける。
     *
     * fgetcsv を使う理由: カンマ区切り・ダブルクォート囲みなど、
     * 一般的なCSV形式を正しく読み取れるため。
     *
     * @return array{header: array<int, string>, rows: array<int, array<int, string|null>>}
     */
    private function parseCsv(string $csvContent): array
    {
        // 文字列を一時的なメモリ上のファイルとして扱う
        $stream = fopen('php://temp', 'r+');
        if ($stream === false) {
            return ['header' => [], 'rows' => []];
        }

        fwrite($stream, $csvContent);
        rewind($stream);

        // 1行目 = ヘッダ
        $header = fgetcsv($stream, 0, ',', '"', '\\');
        if ($header === false) {
            fclose($stream);

            return ['header' => [], 'rows' => []];
        }

        // 2行目以降 = データ
        $rows = [];
        while (($row = fgetcsv($stream, 0, ',', '"', '\\')) !== false) {
            // すべて空の行は無視
            if ($this->isEmptyRow($row)) {
                continue;
            }
            $rows[] = $row;
        }

        fclose($stream);

        return [
            'header' => $header,
            'rows' => $rows,
        ];
    }

    /**
     * fgetcsv の1行を、列名付きの連想配列に変換する。
     *
     * @param array<int, string|null> $row
     * @return array<string, string>
     */
    private function rowToAssoc(array $row): array
    {
        $assoc = [];
        foreach (self::CSV_COLUMNS as $index => $key) {
            $raw = $row[$index] ?? null;
            $assoc[$key] = is_string($raw) ? trim($raw) : '';
        }

        return $assoc;
    }

    /**
     * 行のすべてのセルが空かどうか。
     *
     * @param array<int, string|null> $row
     */
    private function isEmptyRow(array $row): bool
    {
        foreach ($row as $cell) {
            if (is_string($cell) && trim($cell) !== '') {
                return false;
            }
        }

        return true;
    }

    /**
     * 空文字を null に変換する（DBの nullable 列用）。
     */
    private function emptyToNull(string $value): ?string
    {
        if ($value === '') {
            return null;
        }

        return $value;
    }

    /**
     * CSVの真偽値列を bool に変換する。
     *
     * 空欄 → false
     * '1', 'true', 'yes' など → true
     */
    private function parseBoolean(string $value): bool
    {
        $normalized = strtolower(trim($value));

        if ($normalized === '') {
            return false;
        }

        return in_array($normalized, ['1', 'true', 'yes', 'y', 'on'], true);
    }
}
