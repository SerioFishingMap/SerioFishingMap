// 釣果のデータ型を定義
export type FishingResult = {
  FishingTripID: number; // 釣行ID
  SequenceNo: number; // 連番
  FishID: number; // 魚ID
  MemberID: number; // メンバーID
  FishingTypeID: number; // 釣り種別ID
  ToolID: number; // 道具ID
  TackleID: number; // 仕掛けID
  BaitID: number; // 餌ID
  WaterQualityID: number; // 水質ID
  CatchDateTime: string; // 釣れた時間
  TideCondition: number; // 潮の状態
  Weather: number; // 天気
  WaterTemperature: number; // 水温
  WindSpeed: number; // 風速
  WindDirection: number; // 風向き
  WaveHeight: number; // 波の高さ
  Depth: number; // 深さ
  HitPattern: number; // ヒットパターン
  Note: string; // 備考
  Size: number; // サイズ
  IsReleased: boolean; // リリースの有無
  createdAt: string;
  FishingResultID: number;
};

// 新規作成時にAPIが受け取るデータの型
export type CreateFishingResultDTO = Omit<
  FishingResult,
  "FishingResultID" | "createdAt"
>;
