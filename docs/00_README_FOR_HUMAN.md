# care-system docs 人間向けREADME

この `docs/` は、介護保険標準仕様書 第6.0版を前提に、今回のPoCデモを **標準仕様に沿わせながらCursorで小さく実装する** ための資料セットです。

## このdocsの目的

今回のPoCは、介護保険システム全体を作るものではありません。対象は次の2業務です。

- 別紙1 業務フロー `02-01 住民情報異動等に伴う資格異動`
- 別紙1 業務フロー `02-02 被保険者証等再交付`

主なデモ導線は次です。

1. 住民異動イベントをCSVまたは手入力で登録する
2. pending状態のイベントを確認する
3. 資格登録を行う
4. 被保険者番号を自動付番する
5. 被保険者詳細で資格履歴を見る
6. 介護保険被保険者証をプレビュー/PDF出力する
7. 証発行履歴を残す
8. 再交付申請を登録し、再発行する

## 重要な考え方

Cursorに「標準仕様書を読んで実装して」と丸投げしないでください。

標準仕様書原文は量が多く、Cursorが毎回正確に該当箇所だけを読めるとは限りません。そのため、このdocsでは次の形にしています。

```text
標準仕様書 第6.0版 原文
↓
docs/standards/ に必要箇所だけ抽出・要約・制約化
↓
docs/specs/ に画面/API/DB/帳票設計として整理
↓
docs/tasks/ に大きめ工程として整理
↓
docs/tasks_micro/ にCursorへ1回ずつ投げる小タスクとして整理
↓
docs/verification/ で標準仕様から外れていないか確認
```

## 使う順番

人間はまずこの順番で読んでください。

1. `docs/00_README_FOR_HUMAN.md`
2. `docs/01_README_FOR_CURSOR.md`
3. `docs/domain/01_beginner_care_insurance.md`
4. `docs/standards/00_standard_version_lock.md`
5. `docs/standards/02_scope_extraction.md`
6. `docs/specs/01_traceability_matrix.md`
7. `docs/tasks_micro/000_MICRO_TASKS_README.md`

## Cursorへの実装指示の原則

Cursorには `docs/tasks_micro/` を1つずつ投げてください。

```text
今回は docs/tasks_micro/006_01_resident_change_index_api.md のみ実装してください。
変更ファイル数は最大6ファイルまで。
6ファイルを超える場合は実装せず分割案を出してください。
```

この運用により、レビュー不能な巨大差分を避けます。

## 注意

このPoCは「標準仕様書全体への完全準拠システム」ではありません。

正確な位置づけは次です。

> 介護保険システム標準仕様書 第6.0版のうち、被保険者資格の一部業務に沿ったPoCデモ

対象外は明確に切っています。

- 認定管理
- 給付管理
- 保険料賦課
- 保険料収納
- 滞納管理
- 総合事業
- 住所地特例の本格実装
- 適用除外施設の本格実装
- 本物の住民記録システム連携
- 本番認証/権限/監査/非機能要件の完全実装
