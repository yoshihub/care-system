<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * 再交付申請 (reissue_applications) テーブル作成 migration。
 *
 * このテーブルは何か:
 *   被保険者証などを紛失・破損したときに受け付ける「再交付の申請」を1件ずつ残すテーブル。
 *   申請の内容 (誰が・いつ・なぜ申請したか) と、その後の進み具合 (審査・承認・古い証の返還)
 *   をまとめて管理する。
 *
 * どう使われるか:
 *   - 窓口で再交付の申請を受け付けると、このテーブルに1行作る。
 *   - 申請が承認されて実際に証を再発行すると、新しい証発行履歴
 *     (certificate_issue_histories) が1行増え、その行を reissued_issue_history_id で指す。
 *   - 古い証の返還状況 (return_status_code / return_date) もここで追う。
 *
 * 設計メモ:
 *   - 申請区分・状態・返還状況・続柄などはマスタ連携せず文字列コードで保持し、
 *     入力値の妥当性はアプリ側で検証する。
 *   - 再発行がまだ済んでいない申請もあるため、再発行した証への参照は任意 (nullable)。
 */
return new class extends Migration {
    public function up(): void
    {
        Schema::create('reissue_applications', function (Blueprint $table) {
            $table->id();

            // ---- 関連キー (FK) --------------------------------------------

            // この再交付申請が誰のものか。被保険者を消したら申請も一緒に消す
            // (申請だけ残っても意味がないため cascade)。
            $table->foreignId('insured_person_id')
                ->constrained('insured_persons')
                ->cascadeOnDelete();

            // ---- 申請内容 --------------------------------------------------

            // 再交付の対象となる証の種類: 被保険者証 / 資格者証 など。
            $table->string('certificate_type', 32);

            // 申請を受け付けた日。
            $table->date('application_date')->nullable();

            // 申請理由コード (紛失 / 破損 / 汚損 など)。
            $table->string('application_reason_code', 8)->nullable();

            // 申請状態コード (受付済 / 審査中 / 承認 / 却下 など)。
            $table->string('application_status_code', 8)->nullable();

            // ---- 申請者情報 ------------------------------------------------

            // 申請してきた人の氏名 (本人とは限らず家族などのこともある)。
            $table->string('applicant_name', 100)->nullable();

            // 申請者と被保険者の続柄コード (本人 / 配偶者 / 子 など)。
            $table->string('applicant_relationship_code', 8)->nullable();

            // 申請者の連絡先電話番号。
            $table->string('applicant_phone', 20)->nullable();

            // ---- 返還・承認の状況 ------------------------------------------

            // 古い証の返還状況コード (未返還 / 返還済 / 紛失のため返還不可 など)。
            $table->string('return_status_code', 8)->nullable();

            // 古い証が返還された日。
            $table->date('return_date')->nullable();

            // 申請が承認された日。
            $table->date('approval_date')->nullable();

            // ---- 再発行結果 ------------------------------------------------

            // 再発行した結果として作られた証発行履歴への参照。
            // 再発行がまだ済んでいない申請もあるため nullable。
            // 参照先の発行履歴が消えた場合は、この参照だけ NULL にする。
            $table->foreignId('reissued_issue_history_id')
                ->nullable()
                ->constrained('certificate_issue_histories')
                ->nullOnDelete();

            // ---- 補足 ------------------------------------------------------

            // 担当者が自由に書き込める備考。画面上の手入力欄を想定。
            $table->text('remarks')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reissue_applications');
    }
};
