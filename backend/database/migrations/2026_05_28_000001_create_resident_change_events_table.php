<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * 住民異動イベント (resident_change_events) テーブル作成 migration。
 *
 * このテーブルは何か:
 *   住民記録側で起きた異動 (65歳到達・転入・転出・死亡・住所変更・氏名変更) を、
 *   介護保険システムが「これから処理する予定の出来事」として受け取って溜めておく
 *   入口テーブル。本物の住民記録システムとはつながず、CSVの取り込み、または画面からの
 *   手入力でレコードが作られる。
 *
 * どう使われるか:
 *   - ここに登録しただけでは被保険者は作られない。あくまで「未処理の異動メモ」の状態。
 *   - 担当者が一覧で内容を確認し、資格登録に進めると、このイベントをもとに
 *     被保険者 (insured_persons) と資格履歴 (qualification_histories) が作成・更新される。
 *   - 処理が終わったイベントは process_status を processed に変えて、未処理と区別する。
 *
 * 設計メモ:
 *   - 異動時点の氏名・住所をそのまま写し取って保持する (あとから住民票が変わっても、
 *     その異動が起きた時点のスナップショットとして残す)。
 *   - 区分やコードはマスタ連携せず文字列で保持し、入力値の妥当性はアプリ側で検証する。
 *   - 住所地特例や適用除外施設といった特殊判定は行わない。
 */
return new class extends Migration {
    public function up(): void
    {
        Schema::create('resident_change_events', function (Blueprint $table) {
            $table->id();

            // ---- 識別キー -------------------------------------------------

            // 外部 (住民記録/CSV) から受け取るイベントの識別子。
            // 同じイベントを二重に取り込まないよう、DB側で重複を禁止する。
            // 手入力のときは UUID などをアプリ側で発番して入れる。
            $table->string('event_uid', 64)->unique();

            // 自治体コード (6桁)。複数自治体の運用は想定しないが、コードとして持っておく。
            $table->string('municipality_code', 6);

            // 住民記録側の住民番号。被保険者側の resident_no と突き合わせて、
            // 「すでに登録済みの人か、新規の人か」を見分けるための鍵になる。
            $table->string('resident_no', 32);

            // ---- 異動内容 --------------------------------------------------

            // どんな異動かを表す区分。取り得る値は次の6種類:
            //   AGE_65         : 65歳到達
            //   MOVE_IN        : 転入
            //   MOVE_OUT       : 転出
            //   DEATH          : 死亡
            //   ADDRESS_CHANGE : 住所変更
            //   NAME_CHANGE    : 氏名変更
            $table->string('event_type', 32);

            // 異動が発生した日 (住民記録上の事由発生日)。資格の取得日・喪失日を決める根拠。
            $table->date('event_date');

            // 資格取得・喪失の事由を表すコード。
            $table->string('qualification_reason_code', 8)->nullable();

            // ---- 個人基本情報 (異動時点のスナップショット) ----------------

            // 氏名・カナ。氏名変更 (NAME_CHANGE) のときは変更後の氏名が入る。
            $table->string('name', 100);
            $table->string('kana', 200)->nullable();

            // 生年月日。65歳到達かどうかの判定に使うため必須。
            $table->date('birth_date');

            // 性別コード ('1':男 / '2':女 など)。
            $table->string('gender_code', 1)->nullable();

            // ---- 住所 (異動時点のスナップショット) ------------------------

            // 住所変更 (ADDRESS_CHANGE) や転入 (MOVE_IN) のときは変更後の住所が入る。
            // 住民票上の住所そのもので、住所地特例のような特殊判定はしない。
            $table->string('postal_code', 8)->nullable();
            $table->string('pref_name', 20)->nullable();
            $table->string('city_name', 40)->nullable();
            $table->string('town_name', 80)->nullable();
            $table->string('addr_line', 200)->nullable();
            $table->string('addr_building', 200)->nullable();

            // ---- 業務判定補助項目 ------------------------------------------

            // 要介護認定を申請中かどうか。転入時などに資格登録の判断材料として使う。
            $table->boolean('care_application_in_progress')->default(false);

            // ---- 取込トレーサビリティ --------------------------------------

            // どこから入ってきたか: 'csv' (CSV取込) / 'manual' (手入力)。
            // 取り込んだファイル名と行番号も持ち、CSVのどこでエラーが出たかを追える。
            $table->string('source_type', 16)->default('manual');
            $table->string('import_file_name', 255)->nullable();
            $table->unsignedInteger('row_no')->nullable();

            // ---- 処理状態 --------------------------------------------------

            // このイベントの処理がどこまで進んだか:
            //   pending   : 未処理 (資格登録待ち)
            //   processed : 資格登録まで完了
            //   error     : 処理中にエラーが出た (理由は error_message を参照)
            $table->string('process_status', 16)->default('pending');

            // 処理が終わった日時。processed / error に変わるときにアプリ側がセットする。
            $table->timestamp('processed_at')->nullable();

            // エラーになったときの理由。担当者が一覧画面で内容を見て、
            // やり直すかどうかを判断するために使う。
            $table->text('error_message')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resident_change_events');
    }
};
