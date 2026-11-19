// 魚のデータ型を定義
export type Fish = {
  fishID: number;
  fishName: string;
  fishOrder: string;
  category: string;
  createdAt: string;
};

// 新規作成時にAPIが受け取るデータの型
export type CreateFishDTO = Omit<Fish, "createdAt">;
