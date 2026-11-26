// 仕掛けのデータ型を定義
export type Tackle = {
  TackleID: number; // 仕掛けID
  Description: string; // 説明
};

// 新規作成時にAPIが受け取るデータの型
export type CreateTackleDTO = Omit<Tackle, "id" | "createdAt">;
