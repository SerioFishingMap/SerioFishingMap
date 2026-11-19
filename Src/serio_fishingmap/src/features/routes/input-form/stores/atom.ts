import { atom } from "jotai";
import type { InputFormValues } from "../types/input-form-values";
import type { CreateFishingResultDTO } from "@/types/dto/fishing-result-dto";

// 釣果入力フォーム画面の状態をまとめて管理するためのJotaiストア群
export type InputFormStep = "basic" | "environment" | "confirmation";

// バリデーションエラーの保持形式
export type InputFormErrors = Partial<Record<keyof InputFormValues, string>>;
// 各項目のタッチ状態
export type InputFormTouched = Record<keyof InputFormValues, boolean>;
// APIリクエストの進捗
export type InputFormRequestStatus =
  | "idle"
  | "validating"
  | "submitting"
  | "success"
  | "error";

// UI表示用のステート
export type InputFormUiState = {
  currentStep: InputFormStep;
  showConfirmation: boolean;
  showDiscardDialog: boolean;
};

// 初期値をまとめた定数（場所は仮）
export const defaultInputFormValues: InputFormValues = {
  fishingTripId: null, //削除予定
  sequenceNo: null, //削除予定
  fishId: null,
  memberId: null,
  fishingTypeId: null,
  toolId: null,
  tackleId: null,
  baitId: null,
  waterQualityId: null,
  catchDateTime: "",
  tideCondition: null,
  weather: null,
  waterTemperature: null,
  windSpeed: null,
  windDirection: null,
  waveHeight: null,
  depth: null,
  hitPattern: null,
  note: "",
  size: null,
  isReleased: false,
};

// 備考欄の最大文字数
const NOTE_MAX_LENGTH = 500;

// 必須チェック対象のフィールド
type RequiredNumericField =
  | "fishingTripId"
  | "sequenceNo"
  | "fishId"
  | "memberId";

// 必須エラーメッセージをマッピング
const REQUIRED_FIELD_MESSAGES: Record<RequiredNumericField, string> = {
  fishingTripId: "釣行を選択してください",
  sequenceNo: "連番を入力してください",
  fishId: "魚種を選択してください",
  memberId: "メンバーを選択してください",
};

const removeInputFormError = (
  errors: InputFormErrors,
  key: keyof InputFormValues
): InputFormErrors =>
  Object.fromEntries(
    Object.entries(errors).filter(([errorKey]) => errorKey !== key)
  ) as InputFormErrors;

// touched状態の初期化関数
const createDefaultTouchedState = (): InputFormTouched =>
  (Object.keys(defaultInputFormValues) as (keyof InputFormValues)[]).reduce(
    (acc, key) => {
      acc[key] = false;
      return acc;
    },
    {} as InputFormTouched
  );

// 入力値からエラーを導出
export const validateInputForm = (values: InputFormValues): InputFormErrors => {
  const errors: InputFormErrors = {};

  (Object.keys(REQUIRED_FIELD_MESSAGES) as RequiredNumericField[]).forEach(
    (field) => {
      if (values[field] == null) {
        errors[field] = REQUIRED_FIELD_MESSAGES[field];
      }
    }
  );

  if (!values.catchDateTime) {
    errors.catchDateTime = "釣果日時を入力してください";
  }

  if (values.note.trim().length > NOTE_MAX_LENGTH) {
    errors.note = `備考は${NOTE_MAX_LENGTH.toString()}文字以内で入力してください`;
  }

  return errors;
};

// 画面値をAPI DTOに変換
const convertInputFormValuesToDto = (
  values: InputFormValues
): CreateFishingResultDTO => {
  const { fishingTripId, sequenceNo, fishId, memberId } = values;

  if (!values.catchDateTime) {
    throw new Error("釣果日時が未入力です");
  }

  if (fishingTripId == null) {
    throw new Error("fishingTripId is required");
  }

  if (sequenceNo == null) {
    throw new Error("sequenceNo is required");
  }

  if (fishId == null) {
    throw new Error("fishId is required");
  }

  if (memberId == null) {
    throw new Error("memberId is required");
  }

  return {
    FishingTripID: fishingTripId,
    SequenceNo: sequenceNo,
    FishID: fishId,
    MemberID: memberId,
    FishingTypeID: values.fishingTypeId ?? 0,
    ToolID: values.toolId ?? 0,
    TackleID: values.tackleId ?? 0,
    BaitID: values.baitId ?? 0,
    WaterQualityID: values.waterQualityId ?? 0,
    CatchDateTime: new Date(values.catchDateTime).toISOString(),
    TideCondition: values.tideCondition ?? 0,
    Weather: values.weather ?? 0,
    WaterTemperature: values.waterTemperature ?? 0,
    WindSpeed: values.windSpeed ?? 0,
    WindDirection: values.windDirection ?? 0,
    WaveHeight: values.waveHeight ?? 0,
    Depth: values.depth ?? 0,
    HitPattern: values.hitPattern ?? 0,
    Note: values.note,
    Size: values.size ?? 0,
    IsReleased: values.isReleased,
  };
};

// 入力値そのもの
export const inputFormValuesAtom = atom<InputFormValues>(
  defaultInputFormValues
);
// フォーカス済み項目を管理
export const inputFormTouchedAtom = atom<InputFormTouched>(
  createDefaultTouchedState()
);
// リクエスト状態
export const inputFormStatusAtom = atom<InputFormRequestStatus>("idle");
// 現在のフォームステップ
export const inputFormStepAtom = atom<InputFormStep>("basic");
// UI系のフラグまとめ
export const inputFormUiAtom = atom<InputFormUiState>({
  currentStep: "basic",
  showConfirmation: false,
  showDiscardDialog: false,
});
// サーバーからのメッセージ表示用
export const inputFormServerMessageAtom = atom<string | null>(null);

// 開発者が任意に追加するエラー保持用
const inputFormManualErrorsAtom = atom<InputFormErrors>({});

// バリデーションエラーと手動エラーを合算
export const inputFormErrorsAtom = atom((get) => ({
  ...validateInputForm(get(inputFormValuesAtom)),
  ...get(inputFormManualErrorsAtom),
}));

// 手動エラーをセットするためのatom
export const setInputFormManualErrorsAtom = atom(
  null,
  (
    _get,
    set,
    update: InputFormErrors | ((prev: InputFormErrors) => InputFormErrors)
  ) => {
    set(inputFormManualErrorsAtom, update);
  }
);

// 任意のフィールドを更新するためのペイロード
export type InputFormUpdatePayload<
  K extends keyof InputFormValues = keyof InputFormValues,
> = {
  key: K;
  value: InputFormValues[K];
  markTouched?: boolean;
};

// 単項目更新 + タッチ済み判定をまとめたatom
export const updateInputFormAtom = atom(
  null,
  (get, set, payload: InputFormUpdatePayload) => {
    set(inputFormValuesAtom, {
      ...get(inputFormValuesAtom),
      [payload.key]: payload.value,
    });

    if (payload.markTouched !== false) {
      set(inputFormTouchedAtom, {
        ...get(inputFormTouchedAtom),
        [payload.key]: true,
      });
    }

    set(inputFormManualErrorsAtom, (prev) => {
      return removeInputFormError(prev, payload.key);
    });
  }
);

// 初期値と比較して編集中かどうか
export const inputFormIsDirtyAtom = atom((get) => {
  const current = get(inputFormValuesAtom);
  return (Object.keys(current) as (keyof InputFormValues)[]).some(
    (key) => current[key] !== defaultInputFormValues[key]
  );
});

// 1つでもエラーがあるか
export const inputFormHasErrorsAtom = atom((get) =>
  Object.values(get(inputFormErrorsAtom)).some(Boolean)
);

// 送信可能かどうか
export const inputFormCanSubmitAtom = atom((get) => {
  const status = get(inputFormStatusAtom);
  const hasErrors = get(inputFormHasErrorsAtom);
  return !hasErrors && status !== "submitting";
});

// DTOへ変換済みのペイロード
export const inputFormSubmissionPayloadAtom =
  atom<CreateFishingResultDTO | null>((get) => {
    if (get(inputFormHasErrorsAtom)) {
      return null;
    }

    try {
      return convertInputFormValuesToDto(get(inputFormValuesAtom));
    } catch {
      return null;
    }
  });

// 画面状態をまとめて初期化
export const resetInputFormAtom = atom(null, (_get, set) => {
  set(inputFormValuesAtom, defaultInputFormValues);
  set(inputFormTouchedAtom, createDefaultTouchedState());
  set(inputFormStatusAtom, "idle");
  set(inputFormUiAtom, {
    currentStep: "basic",
    showConfirmation: false,
    showDiscardDialog: false,
  });
  set(inputFormServerMessageAtom, null);
  set(inputFormManualErrorsAtom, {});
});

// UI atomを更新する際のペイロード
export type InputFormUiUpdatePayload<
  K extends keyof InputFormUiState = keyof InputFormUiState,
> = {
  key: K;
  value: InputFormUiState[K];
};

// UI表示用のatomを部分更新
export const updateInputFormUiAtom = atom(
  null,
  (get, set, payload: InputFormUiUpdatePayload) => {
    set(inputFormUiAtom, {
      ...get(inputFormUiAtom),
      [payload.key]: payload.value,
    });
  }
);

// ローディング表現を開始
export const markInputFormSubmittingAtom = atom(null, (_get, set) => {
  set(inputFormStatusAtom, "submitting");
});

// 送信結果とメッセージを記録
export const markInputFormResultAtom = atom(
  null,
  (
    _get,
    set,
    result: {
      status: Exclude<InputFormRequestStatus, "submitting">;
      message?: string;
    }
  ) => {
    set(inputFormStatusAtom, result.status);
    set(inputFormServerMessageAtom, result.message ?? null);
  }
);
