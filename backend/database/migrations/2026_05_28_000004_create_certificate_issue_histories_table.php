<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * 証発行履歴 (certificate_issue_histories) テーブル作成 migration。
 *
 * このテーブルは何か:
 *   被保険者証などの証類を「誰に・いつ・どの理由で発行したか」を1件ずつ残す履歴台帳。
 *   新規交付も再交付も、発行のたびに1行積み上がる。
 *
 * どう使われるか:
 *   - 証を発行するたびに1行追加し、被保険者ごとに「いま手元にある有効な証はどれか」を
 *     is_latest = true の行で表す。
 *   - 被保険者詳細画面の「証発行履歴」では、このテーブルを時系列で並べて表示する。
 *   - 再交付の際は、元の証を返還扱いにしつつ、新しい発行履歴を足していく。
 *
 * 設計メモ:
 *   - 申請区分・発行状態・事由などはマスタ連携せず文字列コードで保持し、
 *     入力値の妥当性はアプリ側で検証する。
 *   - is_latest の付け替え (古い行を false にして新しい行を true にする) はアプリ側で行う。
 *   - PDFの実体は持たず、生成済みファイルの場所 (pdf_path) だけを記録する。
 */
return new class extends Migration {
    public function up(): void
    {
        Schema::create('certificate_issue_histories', function (Blueprint $table) {
            $table->id();

            // ---- 関連キー (FK) --------------------------------------------

            // この発行履歴が誰のものか。被保険者を消したら発行履歴も一緒に消す
            // (履歴だけ残っても意味がないため cascade)。
            $table->foreignId('insured_person_id')
                ->constrained('insured_persons')
                ->cascadeOnDelete();

            // ---- 証の種類 --------------------------------------------------

            // 発行した帳票のID (どの様式で出したか)。
            $table->string('form_id', 16)->nullable();

            // 証の種類: 被保険者証 / 資格者証 / 受給資格証明書 など。
            $table->string('certificate_type', 32);

            // ---- 申請・発行の状態 ------------------------------------------

            // 申請区分コード (新規交付 / 再交付 など)。
            $table->string('application_type_code', 8)->nullable();

            // 申請状態コード (受付済 / 審査中 / 決定済 など)。
            $table->string('application_status_code', 8)->nullable();

            // 発行状態コード (未発行 / 発行済 / 返戻 など)。
            $table->string('issue_status_code', 8)->nullable();

            // 発行事由コード (なぜこの証を出すのか)。
            $table->string('issue_reason_code', 8)->nullable();

            // ---- 日付項目 --------------------------------------------------

            // 交付決定日。
            $table->date('decision_date')->nullable();

            // 実際に発行した日。
            $table->date('issue_date')->nullable();

            // 証の有効期限。
            $table->date('expiry_date')->nullable();

            // 証が返還された日時 (再交付で旧証を回収したときなど)。
            $table->timestamp('returned_at')->nullable();

            // ---- 出力ファイル・状態 ----------------------------------------

            // 生成したPDFの保存場所。実体ファイルはここでは持たず、パスだけを記録する。
            $table->string('pdf_path', 255)->nullable();

            // 最新の証フラグ。被保険者ごとに「いま有効な証」1行だけ true になる。
            // 新しい証を発行するときは、アプリ側が古い行を false にしてから
            // 新しい行を true で作る。
            $table->boolean('is_latest')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificate_issue_histories');
    }
};
