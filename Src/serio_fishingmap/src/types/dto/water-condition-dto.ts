// 水質のデータ型を定義
export type WaterCondition = {
  waterQualityID: number; // 水質ID
  transparency: string; // 透明度
  salinity: string; // 塩分濃度
  currentStrength: string; // 流れの強さ
};

// 新規作成時にAPIが受け取るデータの型
export type CreateWaterConditionDTO = Omit<WaterCondition, "id" | "createdAt">;
