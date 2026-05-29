<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * 資格履歴 (qualification_histories) テーブル作成 migration。
 *
 * このテーブルは何か:
 *   被保険者の「介護保険資格がどう変わってきたか」を時系列で記録する履歴台帳。
 *   1人の被保険者に対して、資格を取得した・住所や氏名が変わった・資格を失った
 *   (転出/死亡)・登録を取り消した・取り消しから回復した、といった出来事ごとに
 *   1行ずつ積み上がっていく。
 *
 * どう使われるか:
 *   - 住民の異動 (転入・65歳到達など) が発生すると、その情報をもとに資格登録処理が
 *     このテーブルへ履歴を1行追加し、被保険者本体 (insured_persons) の現在状態も更新する。
 *   - 過去の履歴は消さずに積み上げ、「今この被保険者に効いている資格はどれか」を
 *     is_latest = true の行で表す。
 *   - 被保険者詳細画面の「資格履歴タブ」は、このテーブルを時系列で並べて表示する。
 *
 * 設計メモ:
 *   - 区分やコードはマスタ連携せず文字列で保持し、入力値の妥当性はアプリ側で検証する。
 *   - is_latest の付け替え (古い行を false にして新しい行を true にする) はアプリ側で行う。
 *     DB はデフォルト値 true を持つだけで、排他制御はしない。
 */
return new class extends Migration {
    public function up(): void
    {
        Schema::create('qualification_histories', function (Blueprint $table) {
            $table->id();

            // ---- 関連キー (FK) --------------------------------------------

            // この履歴が誰のものか。被保険者を消したら、その人の履歴も一緒に消す
            // (履歴だけ残っても意味がないため cascade)。
            $table->foreignId('insured_person_id')
                ->constrained('insured_persons')
                ->cascadeOnDelete();

            // この履歴を生むきっかけになった住民異動イベント。
            // 手入力で資格登録した場合などは元イベントが無いので nullable。
            // 元イベントを消しても履歴自体は残す必要があるため、参照だけ NULL にする。
            $table->foreignId('source_event_id')
                ->nullable()
                ->constrained('resident_change_events')
                ->nullOnDelete();

            // ---- 異動内容 --------------------------------------------------

            // 何の異動かを表す区分。取り得る値は次の5種類:
            //   ACQUIRE : 資格取得
            //   CHANGE  : 変更 (住所変更・氏名変更など)
            //   LOSE    : 資格喪失 (転出・死亡など)
            //   CANCEL  : 取消 (誤登録の取り消しなど)
            //   RECOVER : 回復 (取り消した資格を元に戻す)
            $table->string('change_type', 16);

            // 資格取得・喪失の事由を表すコード。住民異動イベントから引き継ぐ。
            $table->string('qualification_reason_code', 8)->nullable();

            // 被保険者種別コード ('1':第1号被保険者 / '2':第2号被保険者 など)。
            $table->string('insured_type_code', 2)->nullable();

            // ---- 日付項目 --------------------------------------------------

            // この履歴が示す異動が発生した日。
            $table->date('qualification_date')->nullable();

            // 住民からの届出を受け付けた日。
            $table->date('notification_date')->nullable();

            // この履歴時点での資格期間。資格を失っていなければ終了日は空のまま。
            $table->date('qualification_start_date')->nullable();
            $table->date('qualification_end_date')->nullable();

            // ---- 状態・補足 ------------------------------------------------

            // 最新履歴フラグ。被保険者ごとに「今効いている」1行だけ true になる。
            // 新しい履歴を足すときは、アプリ側が古い行を false にしてから
            // 新しい行を true で作る。一覧で現在の資格状態を引くときの目印。
            $table->boolean('is_latest')->default(true);

            // 担当者が自由に書き込めるメモ。画面上の手入力欄を想定。
            $table->text('memo')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('qualification_histories');
    }
};
