// 場所のデータ型を定義
export type LocationRecord = {
  locationID: number; // 場所ID
  locationName: string; // 名称
  coordinates: number; // 座標（緯度経度）
  fishingSpotType: number; // 釣り場タイプ
  comfortLevel: number; // 快適性
  hasParking: boolean; // 駐車場の有無
  parkingDistance: number; // 駐車場距離
};

// 新規作成時にAPIが受け取るデータの型
export type CreateLocationRecordDTO = Omit<LocationRecord, "id" | "createdAt">;
