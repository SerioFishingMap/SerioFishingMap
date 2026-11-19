"use client";

import { useAtom } from "jotai";
import { useState, type ChangeEvent } from "react";
import styles from "./page.module.css";
import { AddMemberButton } from "@/components/elements/button/add-member-button/add-member-button";
import { InputFormSubmitButton } from "@/components/elements/button/input-form-submit-button/input-form-submit-button";
import CalendarButton from "@/components/elements/calendar/calendar";
import SelectBox, {
  type SelectOption,
} from "@/components/elements/dropdown/dropdown";
import { Label } from "@/components/elements/Label/Label";
import { TextField } from "@/components/elements/text-field/text-field";
import TextAreaInput from "@/components/elements/textarea/textarea";
import { InputFormResetButton } from "@/features/routes/input-form/components/input-form-reset-button";
import {
  inputFormValuesAtom,
  updateInputFormAtom,
  inputFormErrorsAtom,
  inputFormCanSubmitAtom,
  inputFormSubmissionPayloadAtom,
  inputFormStatusAtom,
  inputFormServerMessageAtom,
  markInputFormSubmittingAtom,
  markInputFormResultAtom,
} from "@/features/routes/input-form/stores/atom";

type NumericField =
  | "fishingTripId"
  | "sequenceNo"
  | "fishId"
  | "memberId"
  | "fishingTypeId"
  | "toolId"
  | "tackleId"
  | "baitId"
  | "waterQualityId"
  | "tideCondition"
  | "weather"
  | "waterTemperature"
  | "windSpeed"
  | "windDirection"
  | "waveHeight"
  | "depth"
  | "hitPattern"
  | "size";

export default function FormPage() {
  const [formValues] = useAtom(inputFormValuesAtom);
  const [, updateInputForm] = useAtom(updateInputFormAtom);
  const [errors] = useAtom(inputFormErrorsAtom);
  const [canSubmit] = useAtom(inputFormCanSubmitAtom);
  const [submissionPayload] = useAtom(inputFormSubmissionPayloadAtom);
  const [status] = useAtom(inputFormStatusAtom);
  const [serverMessage] = useAtom(inputFormServerMessageAtom);
  const [, markSubmitting] = useAtom(markInputFormSubmittingAtom);
  const [, markResult] = useAtom(markInputFormResultAtom);

  const [extraValues, setExtraValues] = useState({
    startTime: "",
    endTime: "",
    locationName: "",
    longitude: "",
    latitude: "",
    fishName: "",
    weight: "",
    rodLength: "",
    reelType: "",
    lineType: "",
    lineThickness: "",
    tackleDetail: "",
    tideLevel: "",
    highTideTime: "",
    tideTypeDetail: "",
    transparency: "",
    fishingMethodDetail: "",
    accessoryInfo: "",
    additionalComment: "",
    contributor: "",
    photoService: "",
  });

  const fishingTypeOptions: SelectOption[] = [
    { label: "選択してください", value: "" },
    { label: "ルアー", value: "1" },
    { label: "エサ釣り", value: "2" },
    { label: "フライ", value: "3" },
  ];

  const tideOptions: SelectOption[] = [
    { label: "選択してください", value: "" },
    { label: "大潮", value: "1" },
    { label: "中潮", value: "2" },
    { label: "小潮", value: "3" },
  ];

  const weatherOptions: SelectOption[] = [
    { label: "選択してください", value: "" },
    { label: "晴れ", value: "1" },
    { label: "くもり", value: "2" },
    { label: "雨", value: "3" },
  ];

  const windDirectionOptions: SelectOption[] = [
    { label: "選択してください", value: "" },
    { label: "北", value: "1" },
    { label: "北東", value: "2" },
    { label: "東", value: "3" },
    { label: "南東", value: "4" },
    { label: "南", value: "5" },
    { label: "南西", value: "6" },
    { label: "西", value: "7" },
    { label: "北西", value: "8" },
  ];

  const waterQualityOptions: SelectOption[] = [
    { label: "選択してください", value: "" },
    { label: "淡水", value: "1" },
    { label: "汽水", value: "2" },
    { label: "海水", value: "3" },
  ];

  const toolOptions: SelectOption[] = [
    { label: "選択してください", value: "" },
    { label: "スピニング", value: "1" },
    { label: "ベイト", value: "2" },
    { label: "餌木", value: "3" },
  ];

  const tackleOptions: SelectOption[] = [
    { label: "選択してください", value: "" },
    { label: "ジグ", value: "1" },
    { label: "ワーム", value: "2" },
    { label: "ウキ", value: "3" },
  ];

  const baitOptions: SelectOption[] = [
    { label: "選択してください", value: "" },
    { label: "エビ", value: "1" },
    { label: "ゴカイ", value: "2" },
    { label: "オキアミ", value: "3" },
  ];

  const hitPatternOptions: SelectOption[] = [
    { label: "選択してください", value: "" },
    { label: "ボトム", value: "1" },
    { label: "中層", value: "2" },
    { label: "表層", value: "3" },
  ];

  const handleNumberChange =
    (key: NumericField) => (event: ChangeEvent<HTMLInputElement>) => {
      const value =
        event.target.value === "" ? null : Number(event.target.value);
      updateInputForm({ key, value });
    };

  const handleSelectNumberChange =
    (key: NumericField) =>
    (value: string): void => {
      updateInputForm({
        key,
        value: value === "" ? null : Number(value),
      });
    };

  const handleStringChange =
    (key: "catchDateTime" | "note") =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateInputForm({ key, value: event.target.value });
    };

  const handleBooleanChange =
    (key: "isReleased") =>
    (value: string): void => {
      updateInputForm({ key, value: value === "true" });
    };

  const handleExtraInputChange =
    (key: keyof typeof extraValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setExtraValues((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const handleExtraTextAreaChange =
    (key: keyof typeof extraValues) =>
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setExtraValues((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const handleSubmit = () => {
    if (!canSubmit || !submissionPayload) {
      markResult({
        status: "error",
        message: "入力項目を確認してください",
      });
      return;
    }

    markSubmitting();
    setTimeout(() => {
      console.info("送信ペイロード", submissionPayload);
      markResult({
        status: "success",
        message: "ダミーリクエストを送信しました",
      });
    }, 400);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>釣果入力フォーム</p>
          <h1 className={styles.title}>フィールドログを記録しましょう</h1>
          <p className={styles.subtitle}>
            釣行の詳細を残して、次の一投の精度を高めます。
          </p>
        </div>
        <div className={styles.actions}>
          <InputFormResetButton />
          <InputFormSubmitButton
            onClick={handleSubmit}
            disabled={!canSubmit || status === "submitting"}
          />
        </div>
      </header>

      <section className={styles.card}>
        <div className={styles.sectionHeader}>
          <Label text="日付と時間" size="subtitle" />
          <span className={styles.sectionHint}>釣行日時をまとめて入力</span>
        </div>
        <div className={styles.sectionGrid}>
          <div className={styles.fieldWithHint}>
            <Label text="日付" size="md" />
            <CalendarButton />
          </div>
          <TextField
            label="開始時間"
            name="startTime"
            type="time"
            value={extraValues.startTime}
            onChange={handleExtraInputChange("startTime")}
            size="md"
            width="100%"
          />
          <TextField
            label="終了時間"
            name="endTime"
            type="time"
            value={extraValues.endTime}
            onChange={handleExtraInputChange("endTime")}
            size="md"
            width="100%"
          />
          <TextField
            label="釣果日時"
            name="catchDateTime"
            type="datetime-local"
            value={formValues.catchDateTime}
            onChange={handleStringChange("catchDateTime")}
            error={errors.catchDateTime}
            size="md"
            width="100%"
          />
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.sectionHeader}>
          <Label text="場所・釣行情報" size="subtitle" />
          <span className={styles.sectionHint}>地図や位置情報に紐づけ</span>
        </div>
        <div className={styles.sectionGrid}>
          <TextField
            label="釣果場所ID"
            name="fishingTripId"
            type="number"
            value={formValues.fishingTripId?.toString() ?? ""}
            onChange={handleNumberChange("fishingTripId")}
            error={errors.fishingTripId}
            size="md"
            width="100%"
          />
          <TextField
            label="場所（都道府県など）"
            name="locationName"
            value={extraValues.locationName}
            onChange={handleExtraInputChange("locationName")}
            size="md"
            width="100%"
          />
          <TextField
            label="経度"
            name="longitude"
            value={extraValues.longitude}
            onChange={handleExtraInputChange("longitude")}
            size="md"
            width="100%"
          />
          <TextField
            label="緯度"
            name="latitude"
            value={extraValues.latitude}
            onChange={handleExtraInputChange("latitude")}
            size="md"
            width="100%"
          />
          <TextField
            label="釣果連番"
            name="sequenceNo"
            type="number"
            value={formValues.sequenceNo?.toString() ?? ""}
            onChange={handleNumberChange("sequenceNo")}
            error={errors.sequenceNo}
            size="md"
            width="100%"
          />
          <SelectBox
            options={tideOptions}
            value={formValues.tideCondition?.toString() ?? ""}
            onChange={handleSelectNumberChange("tideCondition")}
            placeholder="潮を選択"
            label="潮"
          />
          <TextField
            label="潮の流れ"
            name="tideTypeDetail"
            value={extraValues.tideTypeDetail}
            onChange={handleExtraInputChange("tideTypeDetail")}
            size="md"
            width="100%"
          />
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.sectionHeader}>
          <Label text="メンバー" size="subtitle" />
          <span className={styles.sectionHint}>誰の釣果かを記録</span>
        </div>
        <div className={styles.sectionGrid}>
          <TextField
            label="メンバーID"
            name="memberId"
            type="number"
            value={formValues.memberId?.toString() ?? ""}
            onChange={handleNumberChange("memberId")}
            error={errors.memberId}
            size="md"
            width="100%"
          />
          <div className={styles.inlineAction}>
            <AddMemberButton />
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.sectionHeader}>
          <Label text="魚情報" size="subtitle" />
          <span className={styles.sectionHint}>魚種とサイズを記録</span>
        </div>
        <div className={styles.sectionGrid}>
          <SelectBox
            options={[
              { label: "選択してください", value: "" },
              { label: "シーバス", value: "1" },
              { label: "アジ", value: "2" },
              { label: "メバル", value: "3" },
            ]}
            value={formValues.fishId?.toString() ?? ""}
            onChange={handleSelectNumberChange("fishId")}
            placeholder="魚種を選択"
            label="魚種"
          />
          {errors.fishId && (
            <span className={styles.error}>{errors.fishId}</span>
          )}
          <TextField
            label="魚の名前"
            name="fishName"
            value={extraValues.fishName}
            onChange={handleExtraInputChange("fishName")}
            size="md"
            width="100%"
          />
          <TextField
            label="魚ID"
            name="fishId"
            type="number"
            value={formValues.fishId?.toString() ?? ""}
            onChange={handleNumberChange("fishId")}
            error={errors.fishId}
            size="md"
            width="100%"
          />
          <TextField
            label="サイズ（cm）"
            name="size"
            type="number"
            value={formValues.size?.toString() ?? ""}
            onChange={handleNumberChange("size")}
            size="md"
            width="100%"
          />
          <TextField
            label="重さ（g）"
            name="weight"
            type="number"
            value={extraValues.weight}
            onChange={handleExtraInputChange("weight")}
            size="md"
            width="100%"
          />
          <SelectBox
            options={[
              { label: "リリースする", value: "true" },
              { label: "キープする", value: "false" },
            ]}
            value={formValues.isReleased ? "true" : "false"}
            onChange={handleBooleanChange("isReleased")}
            placeholder="選択してください"
            label="キャッチ＆リリース"
          />
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.sectionHeader}>
          <Label text="タックル" size="subtitle" />
          <span className={styles.sectionHint}>使用した道具を記録</span>
        </div>
        <div className={styles.sectionGrid}>
          <SelectBox
            options={toolOptions}
            value={formValues.toolId?.toString() ?? ""}
            onChange={handleSelectNumberChange("toolId")}
            placeholder="使用した道具"
            label="ロッド種別"
          />
          <TextField
            label="竿の長さ"
            name="rodLength"
            value={extraValues.rodLength}
            onChange={handleExtraInputChange("rodLength")}
            size="md"
            width="100%"
          />
          <TextField
            label="リールの種類"
            name="reelType"
            value={extraValues.reelType}
            onChange={handleExtraInputChange("reelType")}
            size="md"
            width="100%"
          />
          <TextField
            label="ラインの種類"
            name="lineType"
            value={extraValues.lineType}
            onChange={handleExtraInputChange("lineType")}
            size="md"
            width="100%"
          />
          <TextField
            label="ラインの太さ"
            name="lineThickness"
            value={extraValues.lineThickness}
            onChange={handleExtraInputChange("lineThickness")}
            size="md"
            width="100%"
          />
          <SelectBox
            options={tackleOptions}
            value={formValues.tackleId?.toString() ?? ""}
            onChange={handleSelectNumberChange("tackleId")}
            placeholder="仕掛けを選択"
            label="仕掛け"
          />
          <TextAreaInput
            label="仕掛けの詳細（針・ハリス・フックなど）"
            value={extraValues.tackleDetail}
            onChange={handleExtraTextAreaChange("tackleDetail")}
            placeholder="使用した仕掛けの情報を入力してください"
          />
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.sectionHeader}>
          <Label text="天候・環境" size="subtitle" />
          <span className={styles.sectionHint}>当日のコンディション</span>
        </div>
        <div className={styles.sectionGrid}>
          <SelectBox
            options={weatherOptions}
            value={formValues.weather?.toString() ?? ""}
            onChange={handleSelectNumberChange("weather")}
            placeholder="天気を選択"
            label="天気"
          />
          <TextField
            label="風速 (m/s)"
            name="windSpeed"
            type="number"
            value={formValues.windSpeed?.toString() ?? ""}
            onChange={handleNumberChange("windSpeed")}
            size="md"
            width="100%"
          />
          <SelectBox
            options={windDirectionOptions}
            value={formValues.windDirection?.toString() ?? ""}
            onChange={handleSelectNumberChange("windDirection")}
            placeholder="風向を選択"
            label="風向"
          />
          <TextField
            label="水温 (°C)"
            name="waterTemperature"
            type="number"
            value={formValues.waterTemperature?.toString() ?? ""}
            onChange={handleNumberChange("waterTemperature")}
            size="md"
            width="100%"
          />
          <TextField
            label="波の高さ (m)"
            name="waveHeight"
            type="number"
            value={formValues.waveHeight?.toString() ?? ""}
            onChange={handleNumberChange("waveHeight")}
            size="md"
            width="100%"
          />
          <SelectBox
            options={waterQualityOptions}
            value={formValues.waterQualityId?.toString() ?? ""}
            onChange={handleSelectNumberChange("waterQualityId")}
            placeholder="水質を選択"
            label="水質"
          />
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.sectionHeader}>
          <Label text="潮汐 / 水深 / 釣法" size="subtitle" />
          <span className={styles.sectionHint}>ポイントの状況</span>
        </div>
        <div className={styles.sectionGrid}>
          <TextField
            label="潮位"
            name="tideLevel"
            value={extraValues.tideLevel}
            onChange={handleExtraInputChange("tideLevel")}
            size="md"
            width="100%"
          />
          <TextField
            label="満潮時刻"
            name="highTideTime"
            type="time"
            value={extraValues.highTideTime}
            onChange={handleExtraInputChange("highTideTime")}
            size="md"
            width="100%"
          />
          <TextField
            label="潮の種類"
            name="tideTypeDetail"
            value={extraValues.tideTypeDetail}
            onChange={handleExtraInputChange("tideTypeDetail")}
            size="md"
            width="100%"
          />
          <TextField
            label="水深 (m)"
            name="depth"
            type="number"
            value={formValues.depth?.toString() ?? ""}
            onChange={handleNumberChange("depth")}
            size="md"
            width="100%"
          />
          <TextField
            label="透明度"
            name="transparency"
            value={extraValues.transparency}
            onChange={handleExtraInputChange("transparency")}
            size="md"
            width="100%"
          />
          <SelectBox
            options={fishingTypeOptions}
            value={formValues.fishingTypeId?.toString() ?? ""}
            onChange={handleSelectNumberChange("fishingTypeId")}
            placeholder="釣法を選択"
            label="釣法の種類"
          />
          <TextAreaInput
            label="釣法の詳細"
            value={extraValues.fishingMethodDetail}
            onChange={handleExtraTextAreaChange("fishingMethodDetail")}
            placeholder="工夫やパターンをメモ"
          />
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.sectionHeader}>
          <Label text="エサ / 仕掛け / パターン" size="subtitle" />
          <span className={styles.sectionHint}>ヒットに繋がった要素</span>
        </div>
        <div className={styles.sectionGrid}>
          <SelectBox
            options={baitOptions}
            value={formValues.baitId?.toString() ?? ""}
            onChange={handleSelectNumberChange("baitId")}
            placeholder="餌を選択"
            label="餌"
          />
          <SelectBox
            options={tackleOptions}
            value={formValues.tackleId?.toString() ?? ""}
            onChange={handleSelectNumberChange("tackleId")}
            placeholder="仕掛けを選択"
            label="仕掛け"
          />
          <SelectBox
            options={hitPatternOptions}
            value={formValues.hitPattern?.toString() ?? ""}
            onChange={handleSelectNumberChange("hitPattern")}
            placeholder="ヒットパターンを選択"
            label="ヒットパターン"
          />
          <TextAreaInput
            label="その他使用した小物"
            value={extraValues.accessoryInfo}
            onChange={handleExtraTextAreaChange("accessoryInfo")}
            placeholder="スナップ・シンカー・補助具など"
          />
          <TextAreaInput
            label={`釣り場の詳細メモ（${formValues.note.length.toString()}/500文字）`}
            value={formValues.note}
            onChange={handleStringChange("note")}
            placeholder="釣り場の状況・気づきを記録"
          />
          {errors.note && <span className={styles.error}>{errors.note}</span>}
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.sectionHeader}>
          <Label text="コメント / 投稿情報" size="subtitle" />
          <span className={styles.sectionHint}>共有に必要な情報</span>
        </div>
        <div className={styles.sectionGrid}>
          <TextAreaInput
            label="釣果に関するコメント"
            value={extraValues.additionalComment}
            onChange={handleExtraTextAreaChange("additionalComment")}
            placeholder="自由記入"
          />
          <TextField
            label="投稿者"
            name="contributor"
            value={extraValues.contributor}
            onChange={handleExtraInputChange("contributor")}
            size="md"
            width="100%"
          />
          <TextField
            label="写真のサービス"
            name="photoService"
            value={extraValues.photoService}
            onChange={handleExtraInputChange("photoService")}
            size="md"
            width="100%"
          />
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.statusPanel}>
          <p className={styles.statusText}>ステータス: {status}</p>
          {serverMessage && (
            <p className={styles.statusMessage}>
              サーバーメッセージ: {serverMessage}
            </p>
          )}
        </div>
        <pre className={styles.debug}>
          {JSON.stringify(formValues, null, 2)}
        </pre>
      </footer>
    </div>
  );
}
