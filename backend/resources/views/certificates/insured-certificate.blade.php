{{--
  介護保険被保険者証 HTML テンプレート。

  このファイルは何か:
    被保険者証プレビュー・PDF 化の元になる Blade テンプレート。
    CertificatePreviewDataService が組み立てた印字項目を簡易レイアウトで表示する。

  どう使われるか:
    - view('certificates.insured-certificate', ['certificate' => $certificate])->render()
    - プレビュー API や PDF 生成処理から HTML 文字列として取得する。

  設計メモ:
    - スタイルはテンプレート内に完結させ、後続の PDF 化でも同じ HTML を使えるようにする。
    - 完全なプレプリント再現は行わず、主要項目を定義リスト形式で見せる PoC 簡易レイアウト。
    - 受け取る $certificate キーは CertificatePreviewDataService::build() の certificate 配列と整合する。

  @var array{
    form_id: string,
    title: string,
    insurer_no: string,
    insurer_name: string,
    insured_no: string,
    name: string,
    kana: string|null,
    birth_date: string|null,
    gender_code: string|null,
    gender_label: string|null,
    address: string,
    issue_date: string,
    qualification_start_date: string|null,
    notice_text: string,
    notes: string|null
  } $certificate
--}}
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $certificate['title'] }}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", Meiryo, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #1a1a1a;
            background: #f3f4f6;
            padding: 24px;
        }
        .certificate {
            max-width: 720px;
            margin: 0 auto;
            background: #fff;
            border: 2px solid #1e3a5f;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            overflow: hidden;
        }
        .certificate__header {
            background: linear-gradient(180deg, #1e3a5f 0%, #2c5282 100%);
            color: #fff;
            text-align: center;
            padding: 20px 24px;
        }
        .certificate__title {
            font-size: 22px;
            font-weight: 700;
            letter-spacing: 0.12em;
        }
        .certificate__body {
            padding: 28px 32px 24px;
        }
        .certificate__grid {
            display: grid;
            grid-template-columns: 9rem 1fr;
            gap: 12px 16px;
            margin-bottom: 24px;
        }
        .certificate__label {
            font-size: 13px;
            font-weight: 600;
            color: #4b5563;
            padding-top: 2px;
        }
        .certificate__value {
            font-size: 15px;
            color: #111827;
            word-break: break-word;
        }
        .certificate__value--name {
            font-size: 18px;
            font-weight: 700;
        }
        .certificate__value--mono {
            font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
            letter-spacing: 0.04em;
        }
        .certificate__notice {
            border: 1px solid #d1d5db;
            border-radius: 4px;
            background: #f9fafb;
            padding: 14px 16px;
            font-size: 13px;
            color: #374151;
            margin-bottom: 16px;
        }
        .certificate__notes {
            font-size: 12px;
            color: #6b7280;
            border-top: 1px dashed #d1d5db;
            padding-top: 12px;
        }
        .certificate__footer {
            font-size: 11px;
            color: #9ca3af;
            text-align: right;
            padding: 8px 16px 12px;
        }
        @media print {
            body { background: #fff; padding: 0; }
            .certificate { box-shadow: none; max-width: none; }
        }
    </style>
</head>
<body>
    <article class="certificate" aria-label="{{ $certificate['title'] }}">
        <header class="certificate__header">
            <h1 class="certificate__title">{{ $certificate['title'] }}</h1>
        </header>

        <div class="certificate__body">
            {{-- 保険者情報 --}}
            <dl class="certificate__grid">
                <dt class="certificate__label">保険者番号</dt>
                <dd class="certificate__value certificate__value--mono">{{ $certificate['insurer_no'] }}</dd>

                <dt class="certificate__label">保険者名</dt>
                <dd class="certificate__value">{{ $certificate['insurer_name'] }}</dd>

                <dt class="certificate__label">被保険者番号</dt>
                <dd class="certificate__value certificate__value--mono">{{ $certificate['insured_no'] }}</dd>

                <dt class="certificate__label">氏名</dt>
                <dd class="certificate__value certificate__value--name">
                    {{ $certificate['name'] }}
                    @if (! empty($certificate['kana']))
                        <span style="font-size: 13px; font-weight: 400; color: #6b7280;">（{{ $certificate['kana'] }}）</span>
                    @endif
                </dd>

                <dt class="certificate__label">生年月日</dt>
                <dd class="certificate__value">{{ $certificate['birth_date'] ?? '—' }}</dd>

                <dt class="certificate__label">性別</dt>
                <dd class="certificate__value">
                    {{ $certificate['gender_label'] ?? $certificate['gender_code'] ?? '—' }}
                </dd>

                <dt class="certificate__label">住所</dt>
                <dd class="certificate__value">{{ $certificate['address'] }}</dd>

                <dt class="certificate__label">交付年月日</dt>
                <dd class="certificate__value">{{ $certificate['issue_date'] }}</dd>

                <dt class="certificate__label">資格取得日</dt>
                <dd class="certificate__value">{{ $certificate['qualification_start_date'] ?? '—' }}</dd>
            </dl>

            {{-- 注意文 --}}
            <section class="certificate__notice" aria-label="注意文">
                {{ $certificate['notice_text'] }}
            </section>

            @if (! empty($certificate['notes']))
                <section class="certificate__notes" aria-label="備考">
                    <strong>備考:</strong> {{ $certificate['notes'] }}
                </section>
            @endif
        </div>

        <footer class="certificate__footer">
            帳票識別子: {{ $certificate['form_id'] }}
        </footer>
    </article>
</body>
</html>
