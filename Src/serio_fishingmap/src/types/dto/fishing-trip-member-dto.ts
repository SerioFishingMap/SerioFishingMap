// 釣行メンバーのデータ型を定義
export type FishingTripMember = {
  fishingMemberID: number; // 釣行メンバーID
  Name: string; // 名前
  FishingStartDate: Date; // 釣り開始年月日
};

// 新規作成時にAPIが受け取るデータの型
export type CreateFishingTripMemberDTO = Omit<
  FishingTripMember,
  "id" | "createdAt"
>;
