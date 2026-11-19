// 釣行のデータ型を定義
export type FishingTrip = {
  fishingTripID: number; //釣行ID
  FishingTripDate: Date; // 釣行日付
  StartTime: Date; // 開始時間
  EndTime: Date; // 終了時間
  LocationID: number; // 釣り場ID
  LocationCrowd?: string; // 釣り場混雑状況
  Note?: string; // 備考
};

// 新規作成時にAPIが受け取るデータの型
export type CreateFishingTripDTO = Omit<FishingTrip, "id" | "createdAt">;
