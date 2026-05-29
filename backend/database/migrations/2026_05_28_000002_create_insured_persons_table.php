<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * 被保険者 (insured_persons) テーブル作成 migration。
 *
 * このテーブルは何か:
 *   介護保険の資格を持つ人、またはこれから持つ候補となる人 (=被保険者) の
 *   基本情報と、いま現在の資格状態をまとめて持つ本体テーブル。
 *   1人につき1行で、その人の「最新の状態」を表す。
 *
 * どう使われるか:
 *   - 住民異動イベント (resident_change_events) を資格登録処理にかけると、
 *     その人がまだ居なければ新規作成、すでに居れば内容を更新する。
 *   - 資格がどう変わってきたかの履歴は別テーブル (qualification_histories) に積み、
 *     こちらはあくまで「今の状態」のサマリを保持する。
 *   - 被保険者一覧・被保険者詳細の画面は、このテーブルを軸に表示する。
 *
 * 設計メモ:
 *   - 被保険者番号 (insured_no) は一人ひとり重複しない番号。採番処理はサービス側が
 *     行うが、二重付番を防ぐため一意制約をDB側にも張る。
 *   - 同じ自治体の中で同じ住民番号 (resident_no) が二重登録されないことが
 *     「既存の人か新規か」を見分ける土台になる。これも複合一意制約で担保する。
 *   - 区分やコードはマスタ連携せず文字列で保持し、入力値の妥当性はアプリ側で検証する。
 *   - 住所地特例や適用除外施設の判定項目は持たない。
 */
return new class extends Migration {
    public function up(): void
    {
        Schema::create('insured_persons', function (Blueprint $table) {
            $table->id();

            // ---- 識別キー -------------------------------------------------

            // 自治体コード (6桁)。複数自治体の運用は想定しないが、コードとして持っておく。
            $table->string('municipality_code', 6);

            // 保険者番号 (6桁)。被保険者証にも印字される。
            $table->string('insurer_no', 6);

            // 住民記録側の住民番号。住民異動イベントの resident_no と対応する。
            // 同一自治体内で重複しないよう、下の複合ユニークで担保する。
            $table->string('resident_no', 32);

            // 被保険者番号 (10桁ゼロ埋め)。一人ひとりを識別する番号。
            // 採番ロジックは別サービスが持ち、ここでは形式と一意性だけを保証する。
            $table->string('insured_no', 10);

            // ---- 個人基本情報 ----------------------------------------------

            // 氏名・カナ (住民異動イベントから写し取る)。
            $table->string('name', 100);
            $table->string('kana', 200)->nullable();

            // 生年月日。65歳到達かどうかの判定に使うため必須。
            $table->date('birth_date');

            // 性別コード ('1':男 / '2':女 など)。
            $table->string('gender_code', 1)->nullable();

            // ---- 住所 ----------------------------------------------------

            $table->string('postal_code', 8)->nullable();
            $table->string('pref_name', 20)->nullable();
            $table->string('city_name', 40)->nullable();
            $table->string('town_name', 80)->nullable();
            $table->string('addr_line', 200)->nullable();
            $table->string('addr_building', 200)->nullable();

            // ---- 資格情報 (いまの状態) ------------------------------------

            // 被保険者種別コード ('1':第1号被保険者 / '2':第2号被保険者 など)。
            $table->string('insured_type_code', 2)->nullable();

            // 資格の状態: active (有効) / lost (喪失) / suspended (停止) など。
            // 新規に資格登録するときは active で作る。
            $table->string('status', 16)->default('active');

            // 直近で資格が動いた日 (取得・変更・喪失のいずれかが起きた日)。
            // 資格履歴の最新行と一致する想定。
            $table->date('latest_qualification_date')->nullable();

            // いま有効な資格の期間。資格を失っていなければ終了日は空のまま。
            $table->date('qualification_start_date')->nullable();
            $table->date('qualification_end_date')->nullable();

            // 被保険者証のいまの状態 (発行済 / 未発行 / 再発行中 など) を表すコード。
            // 発行の細かい履歴は別テーブルで持ち、ここは一覧表示用のサマリ。
            $table->string('current_certificate_status_code', 8)->nullable();

            // 要介護認定を申請中かどうか。資格登録時の判断材料に使う。
            $table->boolean('care_application_in_progress')->default(false);

            // 担当者が自由に書き込める備考。画面上の手入力欄を想定。
            $table->text('notes')->nullable();

            $table->timestamps();

            // ---- 一意制約 -------------------------------------------------

            // 被保険者番号は全体で重複しない (二重付番の防止)。
            $table->unique('insured_no', 'uq_ip_insured_no');

            // 同じ自治体の中では、同じ住民番号の人は1人だけ。
            // 「既存の人か新規か」を見分ける土台になる。
            $table->unique(['municipality_code', 'resident_no'], 'uq_ip_muni_resident');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('insured_persons');
    }
};
