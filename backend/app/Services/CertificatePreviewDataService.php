<?php

namespace App\Services;

use App\Models\InsuredPerson;
use Carbon\CarbonInterface;
use Illuminate\Support\Carbon;
use InvalidArgumentException;

/**
 * 被保険者証プレビュー用データ組み立て Service。
 *
 * このファイルは何か:
 *   介護保険被保険者証の HTML/PDF プレビューに必要な印字項目を、
 *   insured_persons の現行データから組み立てるサービス。あわせて発行可否チェックも担う。
 *
 * どう使われるか:
 *   - 被保険者証プレビュー API (GET /api/insured-persons/{id}/certificate-preview) から呼ばれる。
 *   - 証発行 API (POST /api/certificate-issues) でも assertCanIssue() で発行前チェックに使う想定。
 *   - データ組み立てと可否判定のみ担当し、HTML/PDF 生成は別コンポーネントに委ねる。
 *
 * 設計メモ:
 *   - 印字項目は PoC で扱う被保険者証の主要項目 (保険者情報・被保険者情報・交付日等) に限定する。
 *   - 保険者名は PoC に保険者マスタが無いため、被保険者の都道府県名+市区町村名で代替する。
 *   - 交付年月日 (issue_date) はプレビュー時点の日付 (発行確定前の想定日) とする。
 *   - 認定申請中 (care_application_in_progress) の被保険者は発行不可とする。
 */
class CertificatePreviewDataService
{
    /** 介護保険被保険者証の帳票識別子 (certificate_issue_histories.form_id と整合) */
    private const FORM_ID = '0230010';

    /** 帳票タイトル */
    private const CERTIFICATE_TITLE = '介護保険被保険者証';

    /** 認定申請中による発行不可 */
    public const ISSUE_BLOCK_CODE_CARE_APPLICATION = 'BUSINESS_RULE_001';

    /** 資格無効による発行不可 */
    public const ISSUE_BLOCK_CODE_INACTIVE = 'BUSINESS_RULE_002';

    /** 必須印字項目不足による発行不可 */
    public const ISSUE_BLOCK_CODE_INCOMPLETE = 'BUSINESS_RULE_003';

    /** 性別コード → 印字用ラベル ('1':男 / '2':女) */
    private const GENDER_LABELS = [
        '1' => '男',
        '2' => '女',
    ];

    /** PoC 簡易注意文 (完全な帳票文言の再現はしない) */
    private const DEFAULT_NOTICE_TEXT = 'この証は、介護保険の被保険者であることを証明するものです。';

    /**
     * 被保険者 ID を指定してプレビュー用データを組み立てる。
     *
     * @return array{
     *   issue_eligibility: array{
     *     can_issue: bool,
     *     message: string|null,
     *     code: string|null
     *   },
     *   certificate: array{
     *     form_id: string,
     *     title: string,
     *     insurer_no: string,
     *     insurer_name: string,
     *     insured_no: string,
     *     name: string,
     *     kana: string|null,
     *     birth_date: string|null,
     *     gender_code: string|null,
     *     gender_label: string|null,
     *     address: string,
     *     issue_date: string,
     *     qualification_start_date: string|null,
     *     notice_text: string,
     *     notes: string|null
     *   }
     * }
     */
    public function buildForInsuredPerson(int $insuredPersonId): array
    {
        $person = InsuredPerson::query()->find($insuredPersonId);

        if ($person === null) {
            throw new InvalidArgumentException('指定された被保険者が見つかりません。');
        }

        return $this->build($person);
    }

    /**
     * 被保険者モデルからプレビュー用データを組み立てる。
     *
     * @return array{
     *   issue_eligibility: array{
     *     can_issue: bool,
     *     message: string|null,
     *     code: string|null
     *   },
     *   certificate: array{
     *     form_id: string,
     *     title: string,
     *     insurer_no: string,
     *     insurer_name: string,
     *     insured_no: string,
     *     name: string,
     *     kana: string|null,
     *     birth_date: string|null,
     *     gender_code: string|null,
     *     gender_label: string|null,
     *     address: string,
     *     issue_date: string,
     *     qualification_start_date: string|null,
     *     notice_text: string,
     *     notes: string|null
     *   }
     * }
     */
    public function build(InsuredPerson $person): array
    {
        return [
            'issue_eligibility' => $this->checkIssueEligibility($person),
            'certificate' => $this->buildCertificateData($person),
        ];
    }

    /**
     * 被保険者証を発行できるか判定する (結果のみ返す)。
     *
     * @return array{can_issue: bool, message: string|null, code: string|null}
     */
    public function checkIssueEligibility(InsuredPerson $person): array
    {
        // ---- 認定申請中 -------------------------------------------------
        // 認定申請中は新規交付・再交付とも禁止。
        if ($person->care_application_in_progress) {
            return [
                'can_issue' => false,
                'message' => '認定申請中のため被保険者証を発行できません',
                'code' => self::ISSUE_BLOCK_CODE_CARE_APPLICATION,
            ];
        }

        // ---- 資格状態 ---------------------------------------------------
        // 資格喪失済み (lost 等) の被保険者には証を交付しない。
        if ($person->status !== 'active') {
            return [
                'can_issue' => false,
                'message' => '資格が有効でないため被保険者証を発行できません',
                'code' => self::ISSUE_BLOCK_CODE_INACTIVE,
            ];
        }

        // ---- 印字必須項目 -----------------------------------------------
        if ($person->insured_no === '' || $person->name === '') {
            return [
                'can_issue' => false,
                'message' => '被保険者番号または氏名が未設定のため被保険者証を発行できません',
                'code' => self::ISSUE_BLOCK_CODE_INCOMPLETE,
            ];
        }

        return [
            'can_issue' => true,
            'message' => null,
            'code' => null,
        ];
    }

    /**
     * 発行可能であることを検証し、不可なら InvalidArgumentException を投げる。
     *
     * POST /api/certificate-issues 等、発行処理の入口で利用する想定。
     * コントローラ側で code を取り出して HTTP 422 等に変換する。
     *
     * @throws InvalidArgumentException 発行不可のとき (メッセージに理由、code は previous 等で渡さず message のみ PoC 簡易)
     */
    public function assertCanIssue(InsuredPerson $person): void
    {
        $eligibility = $this->checkIssueEligibility($person);

        if (! $eligibility['can_issue']) {
            throw new InvalidArgumentException($eligibility['message'] ?? '被保険者証を発行できません');
        }
    }

    /**
     * 被保険者証の印字項目を組み立てる。
     *
     * @return array{
     *   form_id: string,
     *   title: string,
     *   insurer_no: string,
     *   insurer_name: string,
     *   insured_no: string,
     *   name: string,
     *   kana: string|null,
     *   birth_date: string|null,
     *   gender_code: string|null,
     *   gender_label: string|null,
     *   address: string,
     *   issue_date: string,
     *   qualification_start_date: string|null,
     *   notice_text: string,
     *   notes: string|null
     * }
     */
    private function buildCertificateData(InsuredPerson $person): array
    {
        $issueDate = Carbon::today();

        return [
            'form_id' => self::FORM_ID,
            'title' => self::CERTIFICATE_TITLE,
            'insurer_no' => $person->insurer_no,
            'insurer_name' => $this->resolveInsurerName($person),
            'insured_no' => $person->insured_no,
            'name' => $person->name,
            'kana' => $person->kana,
            'birth_date' => $this->formatDate($person->birth_date),
            'gender_code' => $person->gender_code,
            'gender_label' => $this->resolveGenderLabel($person->gender_code),
            'address' => $this->formatAddress($person),
            'issue_date' => $issueDate->toDateString(),
            'qualification_start_date' => $this->formatDate($person->qualification_start_date),
            'notice_text' => self::DEFAULT_NOTICE_TEXT,
            'notes' => $person->notes,
        ];
    }

    /**
     * 保険者名を解決する。
     *
     * PoC では保険者マスタを持たないため、被保険者レコードの都道府県名+市区町村名を
     * 保険者 (市区町村) 名として印字する。どちらも無い場合は insurer_no をフォールバック表示。
     */
    private function resolveInsurerName(InsuredPerson $person): string
    {
        $parts = array_filter(
            [$person->pref_name, $person->city_name],
            fn (?string $value) => $value !== null && $value !== '',
        );

        if ($parts !== []) {
            return implode('', $parts);
        }

        return $person->insurer_no;
    }

    /**
     * 性別コードを印字用ラベルに変換する。未知コードは null を返す。
     */
    private function resolveGenderLabel(?string $genderCode): ?string
    {
        if ($genderCode === null || $genderCode === '') {
            return null;
        }

        return self::GENDER_LABELS[$genderCode] ?? null;
    }

    /**
     * 被保険者の住所を帳票印字用に1行へ連結する。
     */
    private function formatAddress(InsuredPerson $person): string
    {
        $parts = array_filter([
            $person->postal_code !== null && $person->postal_code !== ''
                ? '〒'.$person->postal_code
                : null,
            $person->pref_name,
            $person->city_name,
            $person->town_name,
            $person->addr_line,
            $person->addr_building,
        ], fn (?string $part) => $part !== null && $part !== '');

        return $parts !== [] ? implode(' ', $parts) : '—';
    }

    /**
     * 日付属性を YYYY-MM-DD 文字列に整形する。
     */
    private function formatDate(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        if ($value instanceof CarbonInterface) {
            return $value->toDateString();
        }

        if (is_string($value) && $value !== '') {
            return Carbon::parse($value)->toDateString();
        }

        return null;
    }
}
