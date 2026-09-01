# 釣りMAP DynamoDB テーブル設計

## 1. 設計方針

### 構成

DynamoDBテーブルは **1テーブル（シングルテーブル）** とし、以下の5種類のエンティティを同居させる。

- 釣行
- 釣果
- 魚マスタ
- 釣り場マスタ
- メンバーマスタ

テーブル名：`FishingMap`

| キー | 属性名 | 型 | 用途 |
|---|---|---:|---|
| パーティションキー | `PK` | String | エンティティまたは集約単位 |
| ソートキー | `SK` | String | エンティティ種別、子要素、検索補助項目 |
| GSI1 パーティションキー | `GSI1PK` | String | 検索条件の種別と検索値 |
| GSI1 ソートキー | `GSI1SK` | String | 日時順、名前順、IDによる一意化 |

GSIは次の1本を基本とする。

| GSI名 | パーティションキー | ソートキー | 推奨Projection |
|---|---|---|---|
| `GSI1_Search` | `GSI1PK` | `GSI1SK` | `INCLUDE` または `ALL` |

初期リリースではデータ量が少ないと考えられるため、キャパシティモードは `PAY_PER_REQUEST` とする。

---

## 2. アクセスパターン

画面一覧では、`SCR-002 検索画面 (/search)` が「釣果・魚・釣り場を横断的に検索」する画面として定義されている。
本設計では、魚＋メンバー等の複数条件による釣果検索も **SCR-002 検索画面** で使用する。

| No. | 対象 | 検索条件 | 想定検索 | 主な利用画面 |
|---:|---|---|---|---|
| 1 | 釣行 | 釣行日付 | 指定日の釣行一覧 | SCR-401 釣行一覧 |
| 2 | 釣果 | 魚ID | 魚別の釣果一覧、期間指定なし／任意期間 | SCR-002 検索、SCR-101 釣果一覧 |
| 3 | 釣果 | メンバーID | メンバー別の釣果一覧、期間指定なし／任意期間 | SCR-002 検索 |
| 4 | 釣果 | 釣り種別ID | 釣り種別ごとの釣果一覧、期間指定なし／任意期間 | SCR-002 検索 |
| 5 | 釣果 | 釣れた日時 | 指定期間の釣果一覧。検索期間の最大値は設けない | SCR-002 検索、SCR-101 釣果一覧 |
| 6 | 釣果 | 魚＋メンバー等 | 複数条件の組み合わせ検索 | SCR-002 検索 |
| 7 | 魚マスタ | 魚名 | 魚名の部分一致 | SCR-002 検索、SCR-201 魚一覧 |
| 8 | 魚マスタ | 生息地 | 自由記述の生息地に対するキーワード部分一致 | SCR-002 検索、SCR-201 魚一覧 |
| 9 | 釣り場マスタ | 名称 | 釣り場名の部分一致 | SCR-002 検索、SCR-301 釣り場一覧 |
| 10 | 釣り場マスタ | 釣り場タイプ | タイプ別の釣り場一覧 | SCR-301 釣り場一覧 |
| 11 | 釣り場マスタ | 快適性 | 自由記述の快適性に対するキーワード部分一致 | SCR-301 釣り場一覧 |
| 12 | 釣り場マスタ | 駐車場有無 | 駐車場あり・なしの釣り場一覧 | SCR-301 釣り場一覧 |
| 13 | メンバーマスタ | 名前 | メンバー名の部分一致 | SCR-002 検索 |

### 確定要件

- 魚名・釣り場名・メンバー名：**部分一致**
- 生息地・快適性：**自由記述**
- 釣果の記録単位：**魚種＋匹数単位**
- 魚＋メンバー等の組み合わせ検索：**SCR-002 検索画面**
- 釣果検索の最大期間：**無制限**
- マスタ名称変更時の表示：**過去データも最新名称で表示**
- 現在地周辺検索：**現時点では要件なし**
- 位置情報の空間検索方式：将来周辺検索を追加する場合は **Geohashを使用**

## 3. 重要なデータモデリング判断

### 3.1 釣果は「1件 = 1魚種＋匹数」とする

釣果は1匹ごとではなく、**同一の魚種をまとめた匹数単位**で登録する。

- 1釣行に複数の釣果を持つ
- 1釣果には1つの `fish_id` を持つ
- 1釣果には必須の `quantity` を持つ
- `quantity` は1以上の整数とする
- 釣った人は1釣果につき1人の `member_id` を持つ

例：

```json
{
  "fish_id": "FISH-000001",
  "quantity": 5,
  "member_id": "MEMBER-000001"
}
```

同一魚種でも、釣ったメンバー、釣れた日時、仕掛け等を分けて記録したい場合は別の釣果アイテムとして登録する。

### 3.2 IDはStringとする

DynamoDBのキーは、採番BIGINTではなく UUID / ULIDなどの文字列を推奨する。

例：

```text
trip_id     = 01K0ABCDEF1234567890XYZABC
result_id   = 01K0ABCDGH1234567890XYZABC
fish_id     = FISH-000001
location_id = LOC-000001
member_id   = MEMBER-000001
```

ULIDを使用すると、ID自体にもおおむね時系列性を持たせられる。

### 3.3 日時の保存形式

日時はISO 8601形式のStringで保存する。

```text
2026-07-23T06:35:00+09:00
```

GSIのソートキーに使用する日時は、全件で同じタイムゾーン・桁数に統一する。内部検索用としてUTCの `2026-07-22T21:35:00Z` に統一してもよい。

### 3.4 名前の部分一致検索

魚名・釣り場名・メンバー名は部分一致要件のため、表示名とは別に正規化属性を持たせ、さらに **N-gram検索用インデックスアイテム** を作成する。

| 表示属性 | 検索属性例 |
|---|---|
| `fish_name` | `fish_name_normalized` |
| `location_name` | `location_name_normalized` |
| `name` | `name_normalized` |

正規化例：

- Unicode NFKC
- 前後空白除去
- 英字の小文字化
- 全角・半角の統一
- 必要に応じて、ひらがな・カタカナの統一

検索用トークンは正規化文字列から1～3文字のN-gramを生成する。

例：

```text
魚名: クロダイ
正規化: クロダイ

1-gram: ク, ロ, ダ, イ
2-gram: クロ, ロダ, ダイ
3-gram: クロダ, ロダイ
```

検索文字列が3文字以下の場合は対応するN-gramをQueryする。
4文字以上の場合は複数の3-gramをQueryし、アプリケーション側で候補IDを積集合にした後、正規化名に検索文字列が含まれることを最終確認する。

この方式により `begins_with` 前提ではなく任意位置の部分一致を実現する。
ただし、候補件数や検索機能が大きく増える場合は、将来的にAmazon OpenSearch Service等への切り替えも検討する。

### 3.5 生息地・快適性は自由記述とする

`habitat` と `comfort` は列挙値・数値レベルではなく自由記述のStringとして保存する。

```json
{
  "habitat": "沿岸の岩礁帯や港湾部に多い",
  "comfort": "足場が広く、トイレが近いためファミリーでも利用しやすい"
}
```

検索対象とするため、それぞれ正規化属性を持たせる。

```text
habitat_normalized
comfort_normalized
```

検索は名称と同様にN-gram検索用アイテムを用い、自由記述内のキーワード部分一致として扱う。

### 3.6 釣果検索期間は無制限とする

API・画面の検索条件に最大日数・最大月数の制約は設けない。

- 魚別・メンバー別・釣り種別検索は、期間条件を付けないQueryを許可する
- 全釣果の日時検索は月バケット単位でQueryし、対象月の結果をアプリケーション側でマージする
- 長期間検索では取得件数が大きくなるため、レスポンスはページングする
- 「期間無制限」は一括全件返却を意味せず、検索可能期間に上限を設けないことを意味する

### 3.7 マスタ名称は常に最新値を表示する

釣行・釣果にはマスタIDを保持し、画面表示時は魚・釣り場・メンバーマスタを `BatchGetItem` で取得して最新名称を表示する。

過去データに名称スナップショットを保持していても、**画面表示には使用しない**。
本設計では名称の二重管理を避けるため、原則として釣行・釣果から `fish_name` / `member_name` / `location_name` を除外し、IDを参照元とする。

### 3.8 位置情報はGeohashを保持する

現在地周辺検索は現時点では要件に含めない。
ただし、釣り場マスタには将来の空間検索に備えて緯度・経度から算出した `geohash` を保持する。

```text
latitude
longitude
geohash
```

周辺検索を追加する場合はGeohashのprefixを用いた検索アイテムを追加し、候補地点を取得後にアプリケーション側で実距離を判定する。
現時点では周辺検索用GSIは作成しない。

## 4. 基本アイテム設計

## 4.1 釣行アイテム

| 属性 | 値・形式 |
|---|---|
| `PK` | `TRIP#<trip_id>` |
| `SK` | `META` |
| `entity_type` | `TRIP` |
| `trip_id` | 釣行ID |
| `trip_date` | `YYYY-MM-DD` |
| `start_time` | ISO 8601 |
| `end_time` | ISO 8601 |
| `location_id` | 釣り場ID |
| `location_crowd` | 混雑状況 |
| `member_ids` | 参加メンバーID配列 |
| `note` | 備考 |
| `GSI1PK` | `TRIP_DATE#<YYYY-MM-DD>` |
| `GSI1SK` | `<start_time>#TRIP#<trip_id>` |

釣り場名・メンバー名は保持せず、表示時に `location_id` / `member_ids` から最新マスタを取得する。

例：

```json
{
  "PK": "TRIP#01K0TRIP001",
  "SK": "META",
  "entity_type": "TRIP",
  "trip_id": "01K0TRIP001",
  "trip_date": "2026-07-23",
  "start_time": "2026-07-23T05:30:00+09:00",
  "end_time": "2026-07-23T10:00:00+09:00",
  "location_id": "LOC-000001",
  "member_ids": [
    "MEMBER-000001"
  ],
  "note": "",
  "GSI1PK": "TRIP_DATE#2026-07-23",
  "GSI1SK": "2026-07-23T05:30:00+09:00#TRIP#01K0TRIP001"
}
```

### 釣行日の検索

```text
IndexName = GSI1_Search
GSI1PK = TRIP_DATE#2026-07-23
```

同一日の釣行は開始時間順に返る。

## 4.2 釣果アイテム

### 釣果本体

| 属性 | 値・形式 |
|---|---|
| `PK` | `TRIP#<trip_id>` |
| `SK` | `RESULT#<catch_datetime>#<result_id>` |
| `entity_type` | `RESULT` |
| `result_id` | 釣果ID |
| `trip_id` | 釣行ID |
| `sequence_no` | 釣行内連番。画面表示用でありキーには使用しない |
| `fish_id` | 魚ID |
| `quantity` | 匹数。1以上の整数 |
| `member_id` | 釣ったメンバーID |
| `fishing_type_id` | 釣り種別ID |
| `catch_datetime` | ISO 8601 |
| `rod_name` | 竿名 |
| `reel_name` | リール名 |
| `reel_type` | リール種類 |
| `reel_number` | リール号数 |
| `line_type` | ライン種類 |
| `line_number` | ライン号数 |
| `rig` | 仕掛け |
| `bait_id` | 餌ID |
| `water_quality_id` | 水質ID |
| `tide_condition` | 潮の状態 |
| `weather` | 天気 |
| `water_temperature_c` | 水温 |
| `wind_speed_mps` | 風速 |
| `wind_direction` | 風向き |
| `wave_height_m` | 波の高さ |
| `depth_m` | 深さ |
| `hit_pattern` | ヒットパターン |
| `note` | 備考 |
| `size_cm` | サイズ |
| `is_released` | リリース有無 |
| `image_urls` | 画像URL |
| `GSI1PK` | `RESULT_FISH#<fish_id>` |
| `GSI1SK` | `<catch_datetime>#RESULT#<result_id>` |

魚名・メンバー名は釣果本体に保持せず、一覧・詳細表示時に各マスタを取得して最新名称を表示する。

釣行と釣果を同一PKに配置するため、1回のQueryで「釣行の基本情報＋全釣果」を取得できる。

```text
PK = TRIP#<trip_id>
```

釣果だけを取得する場合：

```text
PK = TRIP#<trip_id>
AND begins_with(SK, "RESULT#")
```

例：

```json
{
  "PK": "TRIP#01K0TRIP001",
  "SK": "RESULT#2026-07-23T06:35:00+09:00#01K0RESULT001",
  "entity_type": "RESULT",
  "result_id": "01K0RESULT001",
  "trip_id": "01K0TRIP001",
  "sequence_no": 1,
  "fish_id": "FISH-000001",
  "quantity": 5,
  "member_id": "MEMBER-000001",
  "fishing_type_id": "TYPE-001",
  "catch_datetime": "2026-07-23T06:35:00+09:00",
  "tide_condition": 2,
  "weather": 1,
  "water_temperature_c": 24.5,
  "wind_speed_mps": 2.1,
  "wind_direction": 3,
  "wave_height_m": 0.3,
  "depth_m": 5.0,
  "size_cm": 22.0,
  "is_released": false,
  "GSI1PK": "RESULT_FISH#FISH-000001",
  "GSI1SK": "2026-07-23T06:35:00+09:00#RESULT#01K0RESULT001"
}
```

### メンバー検索用インデックスアイテム

| 属性 | 値・形式 |
|---|---|
| `PK` | `TRIP#<trip_id>` |
| `SK` | `IDX#RESULT#<result_id>#MEMBER` |
| `entity_type` | `RESULT_INDEX` |
| `index_type` | `MEMBER` |
| `target_pk` | 釣果本体のPK |
| `target_sk` | 釣果本体のSK |
| `result_id` | 釣果ID |
| `member_id` | メンバーID |
| `fish_id` | 魚ID。組み合わせFilter用 |
| `fishing_type_id` | 釣り種別ID。組み合わせFilter用 |
| `catch_datetime` | 釣れた日時 |
| `GSI1PK` | `RESULT_MEMBER#<member_id>` |
| `GSI1SK` | `<catch_datetime>#RESULT#<result_id>` |

### 釣り種別検索用インデックスアイテム

| 属性 | 値・形式 |
|---|---|
| `PK` | `TRIP#<trip_id>` |
| `SK` | `IDX#RESULT#<result_id>#TYPE` |
| `entity_type` | `RESULT_INDEX` |
| `index_type` | `TYPE` |
| `fish_id` | 魚ID。組み合わせFilter用 |
| `member_id` | メンバーID。組み合わせFilter用 |
| `GSI1PK` | `RESULT_TYPE#<fishing_type_id>` |
| `GSI1SK` | `<catch_datetime>#RESULT#<result_id>` |
| `target_pk` | 釣果本体のPK |
| `target_sk` | 釣果本体のSK |

### 日時検索用インデックスアイテム

全釣果を単一の `RESULT_DATETIME` パーティションにすると、データ増加時にアクセスが集中する可能性があるため、月単位でバケット化する。

| 属性 | 値・形式 |
|---|---|
| `PK` | `TRIP#<trip_id>` |
| `SK` | `IDX#RESULT#<result_id>#MONTH` |
| `entity_type` | `RESULT_INDEX` |
| `index_type` | `MONTH` |
| `fish_id` | 魚ID。組み合わせFilter用 |
| `member_id` | メンバーID。組み合わせFilter用 |
| `fishing_type_id` | 釣り種別ID。組み合わせFilter用 |
| `GSI1PK` | `RESULT_MONTH#<YYYY-MM>` |
| `GSI1SK` | `<catch_datetime>#RESULT#<result_id>` |
| `target_pk` | 釣果本体のPK |
| `target_sk` | 釣果本体のSK |

### 釣果検索のQuery条件

| 検索 | GSI1PK | GSI1SK条件 |
|---|---|---|
| 魚別 | `RESULT_FISH#<fish_id>` | 期間指定なし、または `BETWEEN` |
| メンバー別 | `RESULT_MEMBER#<member_id>` | 期間指定なし、または `BETWEEN` |
| 釣り種別別 | `RESULT_TYPE#<type_id>` | 期間指定なし、または `BETWEEN` |
| 指定月の全釣果 | `RESULT_MONTH#<YYYY-MM>` | 任意、または日時 `BETWEEN` |

期間指定例：

```text
GSI1PK = RESULT_FISH#FISH-000001
AND GSI1SK BETWEEN
    2026-07-01T00:00:00+09:00
    AND
    2026-07-31T23:59:59+09:00#~
```

期間を指定しない場合は `GSI1PK` のみでQueryし、ページングして全期間を取得可能とする。

全釣果の日時検索で複数月をまたぐ場合は、対象月ごとにQueryを実行してアプリケーション側でマージする。
検索期間の最大月数は設けない。

## 4.3 魚マスタ

### 魚本体

| 属性 | 値・形式 |
|---|---|
| `PK` | `FISH#<fish_id>` |
| `SK` | `META` |
| `entity_type` | `FISH` |
| `fish_id` | 魚ID |
| `fish_name` | 魚名 |
| `fish_name_normalized` | 検索用正規化魚名 |
| `habitat` | 生息地。自由記述 |
| `habitat_normalized` | 生息地検索用正規化文字列 |
| `image_urls` | 画像URL |
| `GSI1PK` | `FISH_ALL` |
| `GSI1SK` | `<fish_name_normalized>#FISH#<fish_id>` |

`FISH_ALL` は魚一覧を名称順に取得するために使用する。

### 魚名部分一致検索用N-gramアイテム

魚名の正規化文字列から1～3文字のN-gramを生成し、トークンごとに検索アイテムを作成する。

```text
PK     = FISH#<fish_id>
SK     = IDX#NAME_NGRAM#<token>
GSI1PK = FISH_NAME_NGRAM#<token>
GSI1SK = <fish_name_normalized>#FISH#<fish_id>
target_pk = FISH#<fish_id>
target_sk = META
```

例：`クロダイ` に対して `ロダ` を検索する場合

```text
GSI1PK = FISH_NAME_NGRAM#ロダ
```

取得後、`fish_name_normalized` に検索文字列全体が含まれることを確認する。

### 生息地部分一致検索用N-gramアイテム

生息地は自由記述とし、列挙値にはしない。
`habitat_normalized` からN-gramを生成して検索する。

```text
PK     = FISH#<fish_id>
SK     = IDX#HABITAT_NGRAM#<token>
GSI1PK = FISH_HABITAT_NGRAM#<token>
GSI1SK = <fish_name_normalized>#FISH#<fish_id>
target_pk = FISH#<fish_id>
target_sk = META
```

生息地の文章が長くなりN-gramアイテム数が過大になる場合は、検索対象文字数の上限設定または検索サービスへの移行を検討する。

## 4.4 釣り場マスタ

### 釣り場本体

| 属性 | 値・形式 |
|---|---|
| `PK` | `LOCATION#<location_id>` |
| `SK` | `META` |
| `entity_type` | `LOCATION` |
| `location_id` | 釣り場ID |
| `location_name` | 名称 |
| `location_name_normalized` | 検索用正規化名称 |
| `latitude` | 緯度 |
| `longitude` | 経度 |
| `geohash` | 緯度・経度から算出したGeohash |
| `fishing_spot_type` | 釣り場タイプ |
| `comfort` | 快適性。自由記述 |
| `comfort_normalized` | 快適性検索用正規化文字列 |
| `has_parking` | 駐車場有無 |
| `parking_detail` | 駐車場備考 |
| `image_urls` | 画像URL |
| `GSI1PK` | `LOCATION_ALL` |
| `GSI1SK` | `<location_name_normalized>#LOCATION#<location_id>` |

`LOCATION_ALL` は釣り場一覧を名称順に取得するために使用する。

### 釣り場名部分一致検索用N-gramアイテム

```text
PK     = LOCATION#<location_id>
SK     = IDX#NAME_NGRAM#<token>
GSI1PK = LOCATION_NAME_NGRAM#<token>
GSI1SK = <location_name_normalized>#LOCATION#<location_id>
target_pk = LOCATION#<location_id>
target_sk = META
```

### 釣り場タイプ検索用インデックスアイテム

```text
PK     = LOCATION#<location_id>
SK     = IDX#TYPE
GSI1PK = LOCATION_TYPE#<fishing_spot_type>
GSI1SK = <location_name_normalized>#LOCATION#<location_id>
```

### 快適性部分一致検索用N-gramアイテム

`comfort` は1～5等の列挙値ではなく自由記述とする。
`comfort_normalized` からN-gramを生成して検索する。

```text
PK     = LOCATION#<location_id>
SK     = IDX#COMFORT_NGRAM#<token>
GSI1PK = LOCATION_COMFORT_NGRAM#<token>
GSI1SK = <location_name_normalized>#LOCATION#<location_id>
target_pk = LOCATION#<location_id>
target_sk = META
```

### 駐車場有無検索用インデックスアイテム

```text
PK     = LOCATION#<location_id>
SK     = IDX#PARKING
GSI1PK = LOCATION_PARKING#<true|false>
GSI1SK = <location_name_normalized>#LOCATION#<location_id>
```

### Geohash

現在地周辺検索は現時点の要件には含めないため、周辺検索専用のGSIアイテムは作成しない。
ただし `geohash` 属性は保持し、将来要件化された場合は以下の形式でGeohash prefixごとの検索アイテムを追加する。

```text
PK     = LOCATION#<location_id>
SK     = IDX#GEOHASH#<precision>#<prefix>
GSI1PK = LOCATION_GEOHASH#<precision>#<prefix>
GSI1SK = <geohash>#LOCATION#<location_id>
```

周辺検索では複数prefixをQueryして候補地点を取得し、緯度・経度による実距離判定で最終的に絞り込む。

## 4.5 メンバーマスタ

| 属性 | 値・形式 |
|---|---|
| `PK` | `MEMBER#<member_id>` |
| `SK` | `META` |
| `entity_type` | `MEMBER` |
| `member_id` | メンバーID |
| `employee_number` | 社員番号 |
| `name` | 名前 |
| `name_normalized` | 検索用正規化名 |
| `fishing_start_date` | 釣り開始年月日 |
| `work_location` | 勤務地 |
| `mail_address` | メールアドレス |
| `GSI1PK` | `MEMBER_ALL` |
| `GSI1SK` | `<name_normalized>#MEMBER#<member_id>` |

### メンバー名部分一致検索用N-gramアイテム

```text
PK     = MEMBER#<member_id>
SK     = IDX#NAME_NGRAM#<token>
GSI1PK = MEMBER_NAME_NGRAM#<token>
GSI1SK = <name_normalized>#MEMBER#<member_id>
target_pk = MEMBER#<member_id>
target_sk = META
```

社員番号やメールアドレスでログイン・一意検索する場合は、一意性確保用のアイテムを追加する。

例：

```text
PK = UNIQUE#MEMBER_MAIL#<mail_address_normalized>
SK = UNIQUE
member_id = <member_id>
```

登録時に `attribute_not_exists(PK)` を条件として書き込み、一意性を保証する。

## 5. アイテム一覧

| エンティティ | PK | SK | GSI1PK | GSI1SK |
|---|---|---|---|---|
| 釣行本体 | `TRIP#id` | `META` | `TRIP_DATE#date` | `start_time#TRIP#id` |
| 釣果本体 | `TRIP#trip_id` | `RESULT#datetime#id` | `RESULT_FISH#fish_id` | `datetime#RESULT#id` |
| 釣果メンバー索引 | `TRIP#trip_id` | `IDX#RESULT#id#MEMBER` | `RESULT_MEMBER#member_id` | `datetime#RESULT#id` |
| 釣果種別索引 | `TRIP#trip_id` | `IDX#RESULT#id#TYPE` | `RESULT_TYPE#type_id` | `datetime#RESULT#id` |
| 釣果月索引 | `TRIP#trip_id` | `IDX#RESULT#id#MONTH` | `RESULT_MONTH#YYYY-MM` | `datetime#RESULT#id` |
| 魚本体 | `FISH#id` | `META` | `FISH_ALL` | `normalized_name#FISH#id` |
| 魚名N-gram索引 | `FISH#id` | `IDX#NAME_NGRAM#token` | `FISH_NAME_NGRAM#token` | `normalized_name#FISH#id` |
| 魚生息地N-gram索引 | `FISH#id` | `IDX#HABITAT_NGRAM#token` | `FISH_HABITAT_NGRAM#token` | `normalized_name#FISH#id` |
| 釣り場本体 | `LOCATION#id` | `META` | `LOCATION_ALL` | `normalized_name#LOCATION#id` |
| 釣り場名N-gram索引 | `LOCATION#id` | `IDX#NAME_NGRAM#token` | `LOCATION_NAME_NGRAM#token` | `normalized_name#LOCATION#id` |
| 釣り場タイプ索引 | `LOCATION#id` | `IDX#TYPE` | `LOCATION_TYPE#value` | `normalized_name#LOCATION#id` |
| 釣り場快適性N-gram索引 | `LOCATION#id` | `IDX#COMFORT_NGRAM#token` | `LOCATION_COMFORT_NGRAM#token` | `normalized_name#LOCATION#id` |
| 釣り場駐車場索引 | `LOCATION#id` | `IDX#PARKING` | `LOCATION_PARKING#bool` | `normalized_name#LOCATION#id` |
| メンバー本体 | `MEMBER#id` | `META` | `MEMBER_ALL` | `normalized_name#MEMBER#id` |
| メンバー名N-gram索引 | `MEMBER#id` | `IDX#NAME_NGRAM#token` | `MEMBER_NAME_NGRAM#token` | `normalized_name#MEMBER#id` |

Geohash周辺検索用アイテムは現時点では作成しない。将来、現在地周辺検索を要件化した時点で追加する。

## 6. 複数条件検索

複数条件による釣果検索は **SCR-002 検索画面** で使用する。

DynamoDBのQueryでは、パーティションキーは1つの値に決定する必要がある。異なる検索軸のGSI結果をRDBのようにサーバー側で結合することはできない。

### 6.1 名称の部分一致からIDを解決する

SCR-002で魚名・メンバー名・釣り場名が文字列入力された場合は、最初にN-gramインデックスをQueryしてマスタIDを取得する。

例：魚名＋メンバー名

1. `FISH_NAME_NGRAM#<token>` をQueryして `fish_id` 候補を取得
2. `MEMBER_NAME_NGRAM#<token>` をQueryして `member_id` 候補を取得
3. 入力文字列全体による部分一致をアプリケーション側で最終確認
4. 解決したIDを使って釣果検索を実行

部分一致により複数IDが候補になる場合は、候補IDごとにQueryし結果をマージする。

### 6.2 初期実装

最も絞り込みやすい条件を `GSI1PK` に選び、残りを `FilterExpression` で絞り込む。

例：魚ID＋メンバーID＋期間

1. `GSI1PK = RESULT_FISH#<fish_id>` でQuery
2. 期間指定がある場合のみ `GSI1SK BETWEEN <from> AND <to>` を付与
3. `FilterExpression: member_id = :member_id`

期間指定なしも許可し、検索可能期間には上限を設けない。

ただし、`FilterExpression` はQuery後に適用され、読み取り済みデータに対する除外となる。対象件数が多い検索には向かない。

### 6.3 高頻度の組み合わせ検索

頻繁に利用され、件数も多い組み合わせだけ合成キーの検索アイテムを追加する。

例：魚＋メンバー

```text
PK     = TRIP#<trip_id>
SK     = IDX#RESULT#<result_id>#FISH_MEMBER
GSI1PK = RESULT_FISH_MEMBER#<fish_id>#<member_id>
GSI1SK = <catch_datetime>#RESULT#<result_id>
```

期間を指定する場合は `GSI1SK BETWEEN` を使用し、指定しない場合は全期間をページング取得する。

例：釣り場タイプ＋駐車場

```text
GSI1PK = LOCATION_TYPE_PARKING#<type>#<true|false>
GSI1SK = <location_name_normalized>#LOCATION#<location_id>
```

すべての組み合わせを事前に作るのではなく、SCR-002の実アクセス頻度・件数を確認してから追加する。

## 7. 更新・削除処理

検索インデックスアイテムは、元のデータと同時に更新する必要がある。

### 釣果登録時の書き込み例

1. 釣果本体
2. メンバー検索用アイテム
3. 釣り種別検索用アイテム
4. 月別日時検索用アイテム
5. 高頻度の組み合わせ検索を採用している場合は、その合成キー索引

これらを `TransactWriteItems` で一括登録する。

### 釣果更新時

魚・メンバー・釣り種別・日時が変更された場合は、次を同一トランザクションで行う。

1. 旧検索インデックスアイテムを削除
2. 釣果本体を更新
3. 新検索インデックスアイテムを登録

`quantity` の変更だけであれば、検索キーに影響しないため釣果本体のみ更新する。

### マスタ更新時

魚名・釣り場名・メンバー名、生息地、快適性が変更された場合は、対応するN-gramアイテムを再生成する。

1. 変更前文字列から生成されていたN-gramアイテムを削除
2. マスタ本体を更新
3. 変更後文字列からN-gramアイテムを生成して登録

過去の釣行・釣果に名称をコピーし直す必要はない。表示時に最新マスタを取得するため、マスタ本体の更新だけで過去データの表示名にも反映される。

### 楽観ロック

本体アイテムに `version` を持たせる。

```json
{
  "version": 3
}
```

更新時は次の条件を使用する。

```text
ConditionExpression = version = :expected_version
```

成功時に `version = version + 1` とする。

## 8. マスタ名称の最新値表示

釣行・釣果には魚・メンバー・釣り場の **IDを保持し、名称は最新マスタから取得する**。

例：

```json
{
  "fish_id": "FISH-000001",
  "member_id": "MEMBER-000001",
  "location_id": "LOC-000001"
}
```

一覧・詳細画面では、Queryで取得したIDを重複排除して `BatchGetItem` で各マスタをまとめて取得する。

表示例：

```text
釣果Query
  ↓
fish_id / member_id / location_id を抽出
  ↓
BatchGetItemでマスタ取得
  ↓
最新 fish_name / member_name / location_name を付与して返却
```

これにより、マスタ名称変更時に過去の釣行・釣果も最新名称で表示される。

名称変更後の参照を維持するため、参照中のマスタは原則として物理削除せず、必要に応じて `is_active` 等による論理削除を使用する。

登録時名称を監査履歴として残したい場合は別の履歴属性を追加できるが、画面表示の名称には使用しない。

## 9. GSI Projectionの選択

### `ALL`

検索結果だけで一覧画面を作りたい場合に簡単だが、保存容量と書き込みコストが増える。

ただし本設計では、名称は常にマスタの最新値を表示するため、釣果検索GSIだけで画面表示を完結させる前提にはしない。

### `INCLUDE` 推奨例

```text
entity_type
result_id
trip_id
fish_id
member_id
fishing_type_id
quantity
catch_datetime
location_id
target_pk
target_sk
```

釣果検索後、`fish_id` / `member_id` / `location_id` からマスタを `BatchGetItem` し、最新名称を付与する。

N-gram検索アイテムでは、候補の最終確認に必要な正規化名と `target_pk` / `target_sk` をProjection対象に含める。

マスタの件数や釣果件数が小さい初期段階では `ALL` で開始し、コストが問題になった段階で `INCLUDE` に変更する判断も可能。

## 10. 非推奨設計

### 検索対象ごとにGSIを無制限に追加する

- 属性追加のたびにGSIが増える
- 書き込みコストと管理負荷が増える
- 複数条件の組み合わせ問題は解決しない

本設計では、検索専用アイテムを作り、`GSI1_Search` を多重利用する。

### すべての検索をScanで行う

データ量に比例して読み取りコストと応答時間が増えるため、管理画面の一時的な用途を除き非推奨。

### 名前の部分一致をFilterExpressionだけで行う

名前一覧を大量に読み取ってから除外することになるため非推奨。
魚名・釣り場名・メンバー名の部分一致はN-gram検索用アイテムを使用する。

### 自由記述の生息地・快適性を列挙値として扱う

今回の要件では自由記述のため、固定コードや1～5等の値に変換しない。
検索が必要な場合は正規化文字列＋N-gramを使用する。

### 釣果内に複数魚種を配列で保存する

今回の釣果単位は「魚種＋匹数」であるため、1釣果には1魚種の `fish_id` と `quantity` を保持する。
複数魚種を配列にすると魚別検索・集計が複雑になるため非推奨。

### 最新名称表示のために過去データを一括更新する

名称変更のたびに過去の釣行・釣果を更新すると書き込み量が増え、更新漏れも起きやすい。
マスタIDを保持し、表示時に最新マスタを取得する。

### 現時点で周辺検索用Geohash索引を作る

現在地周辺検索は要件にないため、検索専用アイテムの生成は不要。
`geohash` 属性のみ保持し、要件化された時点でGeohash prefix索引を追加する。

## 11. 5テーブルに分割する場合

DynamoDBで5テーブルに分割することも可能だが、次の理由から本設計では行わない。

- 釣行と釣果をまとめて取得する際に複数リクエストが必要
- 共通の検索パターンを各テーブルで個別管理する必要がある
- トランザクション・監視・バックアップ設定の管理対象が増える

組織上の権限分離、データ保持期間、スループット特性が大きく異なる場合には分割を検討する。

分割する場合でも、各テーブルのPK/GSIは本設計の `GSI1PK` / `GSI1SK` の考え方を適用できる。

---

## 12. 参考資料

- DynamoDB Query  
  https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html
- Queryのキー条件式  
  https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.KeyConditionExpressions.html
- QueryのFilterExpression  
  https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.FilterExpression.html
- Global Secondary Index  
  https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html
- Sort keyのベストプラクティス  
  https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-sort-keys.html
- 複数属性の合成キーパターン  
  https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.DesignPattern.MultiAttributeKeys.html
- DynamoDB Transactions  
  https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transactions.html
