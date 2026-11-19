// 道具のデータ型を定義
export type Tool = {
  ToolID: number; // 道具ID
  RodType: number; // 竿の種類 列挙型
  ReelType: number; // リールの種類 列挙型
  LineThickness?: number; // ラインの太さ
  LineType: number; // ラインの種類 列挙型
};

// 新規作成時にAPIが受け取るデータの型
export type CreateToolDTO = Omit<Tool, "id" | "createdAt">;
