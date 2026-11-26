# 画面一覧（釣りマップ）

全画面のインデックスです。新規画面は `_template.md` をコピーして作成し、該当グループの表に1行追加してください。
画面IDの採番・語彙は [README.md](./README.md) を参照。遷移は [screen-transition.md](./screen-transition.md) を参照。

> URL・パス／概要は現時点の**仮案**です。仕様確定時に更新してください。
> **対象権限は全画面 `全ユーザー`**（ログイン機能は保留 → [README.md](./README.md) の「権限の扱い」）。括弧内は再検討時の参照用に残した当初案です。

**デザインカンプ列が本一覧と Figma フレームの対応の正典です。**対応は Figma ファイル「セリオ釣りMAP」の `version2.0` 領域のフレームから起こしています（`version1.0` は旧版のため参照しません）。

## 共通・ホーム（SCR-0xx）
| 画面ID | 画面名 | URL・パス | 概要 | 対象権限 | ステータス | 設計書 | デザインカンプ |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SCR-001 | ホーム画面 | `/` | アプリのトップ。最近の釣果や各機能への入口 | 全ユーザー | 下書き | [SCR-001](./SCR-001-home.md) | [ホーム画面](https://www.figma.com/design/LgJDTLLmkMfjeamo0zQl2b/%E3%82%BB%E3%83%AA%E3%82%AA%E9%87%A3%E3%82%8AMAP?node-id=1158-1649) |
| SCR-002 | 検索画面 | `/search` | 釣果・魚・釣り場を横断的に検索 | 全ユーザー | 下書き | [SCR-002](./SCR-002-search.md) | [検索](https://www.figma.com/design/LgJDTLLmkMfjeamo0zQl2b/%E3%82%BB%E3%83%AA%E3%82%AA%E9%87%A3%E3%82%8AMAP?node-id=1158-2009) |
| SCR-003 | お気に入り画面 | `/favorites` | お気に入りに登録した釣り場・魚などの一覧 | 全ユーザー | 下書き | （未作成） | **デザイン未着手**（ナビ項目のみ存在） |

- **SCR-003** はグローバルナビの4項目目「お気に入り」の遷移先として採番しました。Figma にフレームは存在せず、**機能自体も [docs/tasks.md](../tasks.md) の T-38 で保留中**（利用者に紐づけられないため）です。

## 釣果（SCR-1xx）
| 画面ID | 画面名 | URL・パス | 概要 | 対象権限 | ステータス | 設計書 | デザインカンプ |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SCR-101 | 釣果一覧画面 | `/catches` | 投稿された釣果の一覧 | 全ユーザー | 下書き | [SCR-101](./SCR-101-catch-list.md) | [釣果一覧](https://www.figma.com/design/LgJDTLLmkMfjeamo0zQl2b/%E3%82%BB%E3%83%AA%E3%82%AA%E9%87%A3%E3%82%8AMAP?node-id=1159-2799) |
| SCR-102 | 釣果詳細画面 | `/catches/:id` | 釣果1件の詳細（写真・魚種・釣り場・釣行など） | 全ユーザー | 下書き | [SCR-102](./SCR-102-catch-detail.md) | [釣果詳細](https://www.figma.com/design/LgJDTLLmkMfjeamo0zQl2b/%E3%82%BB%E3%83%AA%E3%82%AA%E9%87%A3%E3%82%8AMAP?node-id=1161-2372) |
| SCR-103 | 釣果登録画面 | `/catches/new` | 釣果の新規登録 | 全ユーザー（保留: 会員） | 下書き | [SCR-103](./SCR-103-catch-register.md) | [入力フォーム](https://www.figma.com/design/LgJDTLLmkMfjeamo0zQl2b/%E3%82%BB%E3%83%AA%E3%82%AA%E9%87%A3%E3%82%8AMAP?node-id=1158-1753) |
| SCR-104 | 釣果編集画面 | `/catches/:id/edit` | 釣果の編集 | 全ユーザー（保留: 本人） | 下書き | （未作成） | **デザイン未着手** |

- **SCR-101** は Figma のフレーム名が「釣果一覧」である一方、フレーム内の画面タイトルは**「宇野港で釣れる魚」**です。釣果ではなく「釣り場で絞り込んだ魚の一覧」とも読めるため、割り当ての確定が必要です（[SCR-101](./SCR-101-catch-list.md) の課題1）。
- **SCR-102 釣果詳細**は Figma 上、[SCR-202 魚詳細](./SCR-202-fish-detail.md) の複製に属性テキストを差し替えただけの状態で、釣果固有の設計が未了です（[SCR-102](./SCR-102-catch-detail.md) の課題2）。
- **SCR-104** は Figma にフレームが無く**デザイン未着手**のため、設計書も未作成です。

## 魚図鑑（SCR-2xx）
| 画面ID | 画面名 | URL・パス | 概要 | 対象権限 | ステータス | 設計書 | デザインカンプ |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SCR-201 | 魚一覧画面 | `/fish` | 魚（魚種）の図鑑一覧 | 全ユーザー | 下書き | [SCR-201](./SCR-201-fish-list.md) | [魚一覧表示](https://www.figma.com/design/LgJDTLLmkMfjeamo0zQl2b/%E3%82%BB%E3%83%AA%E3%82%AA%E9%87%A3%E3%82%8AMAP?node-id=1159-2325) |
| SCR-202 | 魚詳細画面 | `/fish/:id` | 魚1種の詳細情報（特徴・関連釣果など） | 全ユーザー | 下書き | [SCR-202](./SCR-202-fish-detail.md) | [魚詳細](https://www.figma.com/design/LgJDTLLmkMfjeamo0zQl2b/%E3%82%BB%E3%83%AA%E3%82%AA%E9%87%A3%E3%82%8AMAP?node-id=1159-3015) |

## 釣り場（SCR-3xx）
| 画面ID | 画面名 | URL・パス | 概要 | 対象権限 | ステータス | 設計書 | デザインカンプ |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SCR-301 | 釣り場一覧画面 | `/spots` | 釣り場の一覧（地図表示に切替可） | 全ユーザー | 下書き | [SCR-301](./SCR-301-spot-list.md) | [釣り場一覧](https://www.figma.com/design/LgJDTLLmkMfjeamo0zQl2b/%E3%82%BB%E3%83%AA%E3%82%AA%E9%87%A3%E3%82%8AMAP?node-id=1159-2582) |
| SCR-302 | 地図画面 | `/map` | 釣り場を地図上に表示 | 全ユーザー | 下書き | [SCR-302](./SCR-302-map.md) | [map](https://www.figma.com/design/LgJDTLLmkMfjeamo0zQl2b/%E3%82%BB%E3%83%AA%E3%82%AA%E9%87%A3%E3%82%8AMAP?node-id=1158-2110) |
| SCR-303 | 釣り場詳細画面 | `/spots/:id` | 釣り場1件の詳細（釣果・アクセスなど） | 全ユーザー | 下書き | [SCR-303](./SCR-303-spot-detail.md) | [map詳細](https://www.figma.com/design/LgJDTLLmkMfjeamo0zQl2b/%E3%82%BB%E3%83%AA%E3%82%AA%E9%87%A3%E3%82%8AMAP?node-id=1159-3258) |

## 釣行（SCR-4xx）— **欠番**

**釣行（Trip）は画面を持ちません。**釣行は釣果登録画面（SCR-103）から入力したデータを釣行記録として保存し、必要な情報のみを各画面で使用するドメイン概念です。専用の一覧・詳細・編集画面は設けません。

- 以前この範囲に置いていた SCR-401 釣行一覧 / SCR-402 釣行詳細 / SCR-403 釣行編集は削除しました。
- **SCR-4xx は欠番のまま残します**（番号を別機能に再利用すると過去のプルリクエスト・レビューと食い違うため）。
- データモデルとしての釣行は存続します（[CLAUDE.md](../../CLAUDE.md) の「ドメインモデル」を参照）。

## マスタ管理（SCR-5xx）
| 画面ID | 画面名 | URL・パス | 概要 | 対象権限 | ステータス | 設計書 | デザインカンプ |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SCR-501 | マスタ追加画面 | （記入） | 魚・釣り場などのマスタを追加する | 全ユーザー | 下書き | [SCR-501](./SCR-501-master-add.md) | [マスタ追加画面](https://www.figma.com/design/LgJDTLLmkMfjeamo0zQl2b/%E3%82%BB%E3%83%AA%E3%82%AA%E9%87%A3%E3%82%8AMAP?node-id=1158-2191) |

- **SCR-501** は Figma のフレーム「マスタ追加画面」から採番しました。フレーム内の注釈は「ユーザなどのマスタを追加していく画面。マスタに追加するのはユーザがマスタに未登録の魚などを自動的に追加していく。」です。自動追加が主なら画面としての導線が要るのか、要確認。Figma のキャンバスに**本フレームへ向かう矢印が1本もない**ため、遷移元も不明です（[SCR-501](./SCR-501-master-add.md) の課題2）。

<!-- 新規画面は _template.md をコピーして作成し、該当グループの表に1行追加してください。 -->
