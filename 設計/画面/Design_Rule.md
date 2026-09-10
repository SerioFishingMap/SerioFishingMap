## 釣りMAP デザイン統一ガイドライン
### 基本方針
- 目的
  - 画面ごとの見た目のばらつきを防止する
  - ユーザーが直感的に操作できるUIを提供する
  - 開発効率を向上させる
  - コンポーネントの再利用性を高める
- 原則
  - 同じ意味の操作は同じ見た目にする
  - 色だけで状態を表現しない
  - アクセシビリティを考慮する
  - 独自デザインより標準的なUIを優先する
### カラールール
- 基本カラー

|用途|色コード|
|---|---|
|Primary|	#2563EB <span style="color: #2563EB;">■</span>|
|Primary Hover| #1D4ED8 <span style="color: #1D4ED8;">■</span>|
|Secondary| #64748B <span style="color: #64748B;">■</span>|
|Success| #16A34A <span style="color: #16A34A;">■</span>|
|Warning| #F59E0B <span style="color: #F59E0B;">■</span>|
|Error| #DC2626 <span style="color: #DC2626;">■</span>|
|Information| #0284C7 <span style="color: #0284C7;">■</span>|


- 背景色

|用途|色コード|
|---|---|
|画面背景| #F8FAFC <span style="color: #F8FAFC;">■</span>|
|カード背景| #FFFFFF <span style="color: #FFFFFF;">■</span>|
|入力欄背景| #FFFFFF <span style="color: #FFFFFF;">■</span>|
|無効項目背景| #E5E7EB <span style="color: #E5E7EB;">■</span>|

- 文字色

|用途|色コード|
|---|---|
|メイン文字| #111827 <span style="color: #111827;">■</span>|
|サブ文字| #6B7280 <span style="color: #6B7280;">■</span>|
|プレースホルダ―| #9CA3AF <span style="color: #9CA3AF;">■</span>|
|リンク| #2563EB <span style="color: #2563EB;">■</span>|
|エラー文字| #DC2626 <span style="color: #DC2626;">■</span>|

### ボタンルール
- Primary Button
  - 用途
    - 登録、保存、実行
  - 通常時
    - 背景: #2563EB <span style="color: #2563EB;">■</span>
    - 文字: #FFFFFF <span style="color: #FFFFFF;">■</span>
  - Hover時
    - 背景: #1D4ED8 <span style="color: #1D4ED8;">■</span>
  - Active時
    - 背景: #1E40AF <span style="color: #1E40AF;">■</span>

- Disabled
  - 背景: #CBD5E1 <span style="color: #CBD5E1;">■</span>
  - 文字: #94A3B8 <span style="color: #94A3B8;">■</span>
  - カーソル: not-allowed

- Secondary Button
  - 用途
    - キャンセル、戻る
  - 背景: #FFFFFF <span style="color: #FFFFFF;">■</span>
  - 文字: #374151 <span style="color: #374151;">■</span>
  - 枠線: 1px solid #D1D5DB <span style="color: #D1D5DB;">■</span>

- 危険操作ボタン
  - 用途
    - 削除、取消
  - 背景: #DC2626 <span style="color: #DC2626;">■</span>
  - 文字: #FFFFFF <span style="color: #FFFFFF;">■</span>

### 入力フォーム
- TextBox
  - 高さ: 40px
  - 枠線: 1px solid #D1D5DB <span style="color: #D1D5DB;">■</span>
  - 角丸: 6px
  - フォーカス時
    - border: 2px solid #2563EB <span style="color: #2563EB;">■</span>
  - エラー時
    - border: 2px solid #DC2626 <span style="color: #DC2626;">■</span>
  - 必須項目
    - ラベル横に表示
      - ```氏名 *``` または ```氏名 [必須]```
    - 色
      - #DC2626 <span style="color: #DC2626;">■</span>

### テーブル
- ヘッダー
  - 背景 #F1F5F9 <span style="color: #F1F5F9;">■</span>
  - 文字 #111827 <span style="color: #111827;">■</span>
  - 太字
- 行
  - 通常
    - 背景 #FFFFFF <span style="color: #FFFFFF;">■</span>
  - Hover
  - 背景 #EFF6FF <span style="color: #EFF6FF;">■</span>
- 選択中
  - 背景 #DBEAFE <span style="color: #DBEAFE;">■</span>
- 行高
  - 44px

### 枠線ルール
- 基本
  - 1px solid #E5E7EB <span style="color: #E5E7EB;">■</span>
- 強調領域
  - 2px solid #CBD5E1 <span style="color: #CBD5E1;">■</span>

- 枠線は3種類まで
  - 0px（なし）
  - 1px（通常）
  - 2px（強調）

- 3px以上は原則禁止

### 余白ルール
- 8px単位で統一
  - 4px  （アイコン間）
  - 8px  （ラベル周辺）
  - 16px （コンポーネント間）
  - 24px （セクション内）
  - 32px （画面ブロック間）
  - 48px （大見出し）

### アイコン
- 使用ライブラリ
  - Material Symbols
- 禁止
  - 複数ライブラリ混在

### メッセージ表示
- 成功
  - 背景 #DCFCE7 <span style="color: #DCFCE7;">■</span>
  - 文字 #166534 <span style="color: #166534;">■</span>
  - 例
    - 保存しました
- エラー
  - 背景 #FEE2E2 <span style="color: #FEE2E2;">■</span>
  - 文字 #991B1B <span style="color: #991B1B;">■</span>
  - 例
    - 保存できませんでした
- 警告
  - 背景 #FEF3C7 <span style="color: #FEF3C7;">■</span>
  - 文字 #92400E <span style="color: #92400E;">■</span>

### ローディング
- 画面全体ローディング
  - 例
    - データ読込中...
  - スピナー表示
- ボタン処理中
  - 例
    - 保存中...
- ボタン二重押下禁止

### レスポンシブ
- ブレイクポイント
  - スマホ  ～767px
  - タブレット 768～1279px
  - PC 1280px～

### フォントサイズ体系
- 12px
- 14px
- 16px
- 20px
- 24px

### ボタンサイズ

- S: 32px
- M: 40px
- L: 48px
