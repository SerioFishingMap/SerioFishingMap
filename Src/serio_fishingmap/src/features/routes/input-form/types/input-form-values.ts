// フォームで扱う全入力値の型
export type InputFormValues = {
  fishingTripId: number | null;
  sequenceNo: number | null;
  fishId: number | null;
  memberId: number | null;
  fishingTypeId: number | null;
  toolId: number | null;
  tackleId: number | null;
  baitId: number | null;
  waterQualityId: number | null;
  catchDateTime: string;
  tideCondition: number | null;
  weather: number | null;
  waterTemperature: number | null;
  windSpeed: number | null;
  windDirection: number | null;
  waveHeight: number | null;
  depth: number | null;
  hitPattern: number | null;
  note: string;
  size: number | null;
  isReleased: boolean;
};
