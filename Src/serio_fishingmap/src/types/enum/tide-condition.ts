// 潮の状態（例: 潮の干満）
export const TideCondition = [
  { code: 0, enLabel: "Unknown", jpLabel: "不明" },
  { code: 1, enLabel: "High", jpLabel: "満潮" },
  { code: 2, enLabel: "Low", jpLabel: "干潮" },
  { code: 3, enLabel: "Rising", jpLabel: "上げ潮" },
  { code: 4, enLabel: "Falling", jpLabel: "下げ潮" },
] as const;
