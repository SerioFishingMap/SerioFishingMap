ワークスペース情報を収集しています以下の DTO ファイルごとに、DB の読み書きに必要な API（CRUD）を洗い出しました。  
各エンティティごとに、基本的な API は共通です。

---

### 1. `fish-dto.ts`

- 魚データ
  - 一覧取得: GET `/api/fish`
  - 単一取得: GET `/api/fish/{id}`
  - 新規作成: POST `/api/fish`
  - 更新: PUT/PATCH `/api/fish/{id}`
  - 削除: DELETE `/api/fish/{id}`

---

### 2. `fishing-result-dto.ts`

- 釣果データ
  - 一覧取得: GET `/api/fishing-result`
  - 単一取得: GET `/api/fishing-result/{id}`
  - 新規作成: POST `/api/fishing-result`
  - 更新: PUT/PATCH `/api/fishing-result/{id}`
  - 削除: DELETE `/api/fishing-result/{id}`

---

### 3. `fishing-trip-dto.ts`

- 釣行データ
  - 一覧取得: GET `/api/fishing-trip`
  - 単一取得: GET `/api/fishing-trip/{id}`
  - 新規作成: POST `/api/fishing-trip`
  - 更新: PUT/PATCH `/api/fishing-trip/{id}`
  - 削除: DELETE `/api/fishing-trip/{id}`

---

### 4. `fishing-trip-member-dto.ts`

- 釣行メンバー
  - 一覧取得: GET `/api/fishing-trip-member`
  - 単一取得: GET `/api/fishing-trip-member/{id}`
  - 新規作成: POST `/api/fishing-trip-member`
  - 更新: PUT/PATCH `/api/fishing-trip-member/{id}`
  - 削除: DELETE `/api/fishing-trip-member/{id}`

---

### 5. `location-dto.ts`

- 釣り場（ロケーション）
  - 一覧取得: GET `/api/location`
  - 単一取得: GET `/api/location/{id}`
  - 新規作成: POST `/api/location`
  - 更新: PUT/PATCH `/api/location/{id}`
  - 削除: DELETE `/api/location/{id}`

---

### 6. `tackle-dto.ts`

- タックル
  - 一覧取得: GET `/api/tackle`
  - 単一取得: GET `/api/tackle/{id}`
  - 新規作成: POST `/api/tackle`
  - 更新: PUT/PATCH `/api/tackle/{id}`
  - 削除: DELETE `/api/tackle/{id}`

---

### 7. `tool-dto.ts`

- 道具
  - 一覧取得: GET `/api/tool`
  - 単一取得: GET `/api/tool/{id}`
  - 新規作成: POST `/api/tool`
  - 更新: PUT/PATCH `/api/tool/{id}`
  - 削除: DELETE `/api/tool/{id}`

---

### 8. `water-condition-dto.ts`

- 水況
  - 一覧取得: GET `/api/water-condition`
  - 単一取得: GET `/api/water-condition/{id}`
  - 新規作成: POST `/api/water-condition`
  - 更新: PUT/PATCH `/api/water-condition/{id}`
  - 削除: DELETE `/api/water-condition/{id}`

---

**備考:**

- それぞれの DTO に対応する CRUD API が必要です。
- 複雑なリレーションや検索条件がある場合は、追加の API（例: 絞り込み検索、複合主キー取得など）が必要になる場合があります。
- 詳細なエンドポイント設計やパラメータは、釣りマップ API 一覧.md も参照してください。

---

例：魚リポジトリのデータ操作

### 1. 一覧取得（GET All）

- **用途:** 全レコードの取得
- **例:** `/api/fish` で全魚データ取得
- **必要な DTO:** レコード型（例: `Fish`）

---

### 2. 単一取得（GET by ID）

- **用途:** 主キーで 1 件取得
- **例:** `/api/fish/{id}` で特定魚データ取得
- **必要な DTO:** レコード型（例: `Fish`）

---

### 3. 新規作成（POST）

- **用途:** 新しいレコードの追加
- **例:** `/api/fish` で魚データ追加
- **必要な DTO:** 作成用 DTO（例: `CreateFishDTO`）

---

### 4. 更新（PUT/PATCH）

- **用途:** 既存レコードの更新
- **例:** `/api/fish/{id}` で魚データ更新
- **必要な DTO:** 更新用 DTO（通常は `Fish` か部分型）

---

### 5. 削除（DELETE）

- **用途:** レコードの削除
- **例:** `/api/fish/{id}` で魚データ削除
- **必要な DTO:** 主キーのみ

---

#### 例: `fish-dto.ts`

- 一覧取得: `Fish[]`
- 単一取得: `Fish`
- 新規作成: `CreateFishDTO`
- 更新: `Fish` または部分型
- 削除: `fishID` など主キー

---

他の DTO ファイル（例: `fishing-result-dto.ts`, `tool-dto.ts` など）も同様に、

- 一覧取得
- 単一取得
- 新規作成
- 更新
- 削除  
  の API が必要です。

---

各 DTO ごとに必要な API の詳細が必要な場合は、該当ファイル名を指定してください。
