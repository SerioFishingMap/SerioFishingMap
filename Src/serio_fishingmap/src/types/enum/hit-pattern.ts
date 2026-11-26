// hit-pattern-type.ts
export const HitPattern = [
  { code: 0, enLabel: "Unknown", jpLabel: "不明" },
  { code: 1, enLabel: "SlowRetrieve", jpLabel: "ゆっくり巻き" },
  { code: 2, enLabel: "FastRetrieve", jpLabel: "早巻き" },
  { code: 3, enLabel: "Twitch", jpLabel: "トゥイッチ" },
  { code: 4, enLabel: "BottomBump", jpLabel: "底ズル" },
  { code: 5, enLabel: "Surface", jpLabel: "表層" },
] as const;
