# 初心者向け：画面・API・DB・帳票の対応

## この資料の目的

この資料は、今回作る画面が、どのAPIを呼び、どのDBを使い、どの帳票につながるかを初心者向けに整理したものです。

実装で迷ったら、まずこの対応表を見てください。

---

## 全体対応表

| 業務 | 画面 | API | DB | 帳票 |
|---|---|---|---|---|
| 住民異動を受け取る | 住民異動イベント登録・一覧 | POST/GET resident-change-events | resident_change_events | なし |
| 資格を登録する | 資格異動登録 | POST qualification-transitions | insured_persons, qualification_histories | なし |
| 被保険者を見る | 被保険者一覧・詳細 | GET insured-persons | insured_persons, qualification_histories | なし |
| 被保険者証を出す | 被保険者証プレビュー | GET certificate-preview / PDF | insured_persons, certificate_issue_histories | 0230010 |
| 証発行履歴を見る | 証発行履歴 | GET certificate-issues | certificate_issue_histories | なし |
| 再交付申請する | 再交付申請 | POST reissue-applications | reissue_applications | 0230014 Stretch |
| 再発行する | 再発行 | POST reissue | certificate_issue_histories | 0230010 |

---

# 画面1：住民異動イベント登録・一覧

## 何をする画面か

住民記録システムから受け取るはずの住民異動情報を、今回のPoCでは手入力またはCSVで登録します。

## 画面に出す主な項目

| 項目 | 説明 |
|---|---|
| 異動種別 | AGE_65、MOVE_IN、MOVE_OUTなど |
| 異動日 | 住民情報が変わった日 |
| 宛名番号 | 住民を識別する番号 |
| 氏名 | 対象者の名前 |
| 生年月日 | 対象者の生年月日 |
| 住所 | 対象者の住所 |
| 処理状態 | pending、processed、error |

## 呼び出すAPI

| Method | API | 用途 |
|---|---|---|
| GET | `/api/v1/resident-change-events` | 一覧取得 |
| POST | `/api/v1/resident-change-events` | 手入力登録 |
| POST | `/api/v1/resident-change-events/import` | CSV取込 |

## 使うDB

```text
resident_change_events
```

## 実装時のポイント

- 最初は手入力登録だけでもよい。
- CSV取込は後から追加でもよい。
- 処理前は `pending` にする。
- 資格登録したら `processed` にする。

---

# 画面2：資格異動登録

## 何をする画面か

住民異動イベントをもとに、介護保険の資格を登録します。

例：

- 65歳到達 → 資格取得
- 転入 → 資格取得
- 転出 → 資格喪失
- 死亡 → 資格喪失
- 住所変更 → 資格変更

## 画面に出す主な項目

| 項目 | 説明 |
|---|---|
| 対象者情報 | 氏名、生年月日、住所など |
| 異動種別 | AGE_65など |
| 資格異動区分 | acquire、change、loss |
| 資格異動日 | 資格が変わる日 |
| 資格取得日 | 資格取得の場合に入る |
| 資格喪失日 | 資格喪失の場合に入る |
| 被保険者区分 | 第1号、第2号 |
| 認定申請中フラグ | 被保険者証発行可否に関係 |

## 呼び出すAPI

| Method | API | 用途 |
|---|---|---|
| POST | `/api/v1/qualification-transitions` | 資格異動登録 |

## 使うDB

```text
insured_persons
qualification_histories
resident_change_events
```

## 実装時のポイント

- 新規資格取得なら `insured_persons` を作る。
- 既存者の変更なら `insured_persons` を更新する。
- 必ず `qualification_histories` に履歴を残す。
- 被保険者番号は新規資格取得時に自動採番する。
- 元の `resident_change_events` は `processed` にする。

---

# 画面3：被保険者一覧

## 何をする画面か

登録済みの被保険者を一覧で見る画面です。

## 画面に出す主な項目

| 項目 | 説明 |
|---|---|
| 被保険者番号 | 介護保険の番号 |
| 宛名番号 | 住民側の番号 |
| 氏名 | 対象者名 |
| 生年月日 | 生年月日 |
| 状態 | active、lostなど |
| 資格取得日 | いつ資格取得したか |

## 呼び出すAPI

| Method | API | 用途 |
|---|---|---|
| GET | `/api/v1/insured-persons` | 一覧取得 |

## 使うDB

```text
insured_persons
qualification_histories
```

---

# 画面4：被保険者詳細

## 何をする画面か

1人の被保険者について、基本情報、資格履歴、証発行履歴、再交付申請履歴を確認します。

## 画面に出すブロック

| ブロック | 内容 |
|---|---|
| 基本情報 | 氏名、生年月日、住所、被保険者番号 |
| 資格情報 | 現在の資格状態 |
| 資格履歴 | 過去の資格変更履歴 |
| 証発行履歴 | 被保険者証をいつ発行したか |
| 再交付申請履歴 | 再交付申請の履歴 |

## 呼び出すAPI

| Method | API | 用途 |
|---|---|---|
| GET | `/api/v1/insured-persons/{id}` | 詳細取得 |

## 使うDB

```text
insured_persons
qualification_histories
certificate_issue_histories
reissue_applications
```

---

# 画面5：被保険者証プレビュー

## 何をする画面か

被保険者証を画面で確認し、PDF出力または発行処理をします。

## 表示する主な項目

| 項目 | 説明 |
|---|---|
| 被保険者番号 | 介護保険の番号 |
| 氏名 | 対象者名 |
| 生年月日 | 生年月日 |
| 性別 | 性別 |
| 住所 | 住所 |
| 交付年月日 | 証を交付する日 |
| 保険者番号 | 自治体の保険者番号 |
| 保険者名 | 自治体名 |

## 呼び出すAPI

| Method | API | 用途 |
|---|---|---|
| GET | `/api/v1/certificates/{insuredPersonId}/preview` | HTMLプレビュー |
| GET | `/api/v1/certificates/{insuredPersonId}/pdf` | PDF出力 |
| POST | `/api/v1/certificate-issues` | 発行履歴保存 |

## 使うDB

```text
insured_persons
certificate_issue_histories
```

## 帳票

```text
0230010 介護保険被保険者証
```

## 実装時のポイント

- `care_application_in_progress = true` の場合は、被保険者証を発行しない。
- 被保険者番号がない場合は発行しない。
- 発行したら `certificate_issue_histories` に履歴を保存する。

---

# 画面6：再交付申請

## 何をする画面か

被保険者証をなくした・壊したなどの再交付申請を登録します。

## 画面に出す主な項目

| 項目 | 説明 |
|---|---|
| 申請日 | 再交付申請した日 |
| 申請理由 | 紛失、破損、汚損など |
| 申請者氏名 | 本人または代理人 |
| 続柄 | 本人、家族など |
| 電話番号 | 連絡先 |
| 返還状況 | 古い証を返したか |

## 呼び出すAPI

| Method | API | 用途 |
|---|---|---|
| POST | `/api/v1/reissue-applications` | 再交付申請登録 |
| POST | `/api/v1/reissue-applications/{id}/reissue` | 再発行 |

## 使うDB

```text
reissue_applications
certificate_issue_histories
```

## 帳票

```text
0230014 介護保険 被保険者証等再交付申請書
```

ただし、0230014のPDF化はStretchです。

---

# DBテーブルの役割まとめ

## insured_persons

被保険者の基本情報を持つテーブルです。

例：

- 被保険者番号
- 宛名番号
- 氏名
- 生年月日
- 住所
- 現在の資格状態

---

## resident_change_events

住民異動イベントを持つテーブルです。

例：

- 65歳到達
- 転入
- 転出
- 死亡
- 住所変更

---

## qualification_histories

資格の変更履歴を持つテーブルです。

例：

- 2026/7/1 資格取得
- 2026/8/1 住所変更
- 2027/3/31 資格喪失

---

## certificate_issue_histories

証の発行履歴を持つテーブルです。

例：

- 2026/7/1 被保険者証を新規発行
- 2026/9/1 被保険者証を再交付

---

## reissue_applications

再交付申請を持つテーブルです。

例：

- 紛失による再交付申請
- 破損による再交付申請

---

# 実装の順番

初心者は以下の順番で作るのが安全です。

```text
1. DB migration
2. Seeder
3. Laravel API
4. Next.js画面の土台
5. 被保険者一覧
6. 被保険者詳細
7. 住民異動イベント登録
8. 資格異動登録
9. 被保険者証HTMLプレビュー
10. PDF出力
11. 証発行履歴
12. 再交付申請
13. 再発行
```

画面から先に作ると、APIやDBが決まっていなくて手戻りしやすいです。

まずDBとAPIを固めるのが安全です。
