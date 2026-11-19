"use client";

import type { LatLng } from "leaflet";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import styles from "./map.module.css";
import { isMock } from "@/config/env";
import { useLeafletMap } from "@/features/routes/fishing-spot-main-map/hooks/useLeafletMap";

// 実APIが未整備のため、型とモックデータをこのコンポーネント内に定義
type FishingSpotSummary = {
  id: number;
  name: string;
  coordinate: [number, number];
  shortDescription: string;
};

type FishingSpotDetail = FishingSpotSummary & {
  description: string;
  targetFish: string[];
  bestSeason: string;
  waterDepth: string;
  note: string;
};

// 地図上に表示する仮のスポット一覧を取得
const MOCK_SPOTS: FishingSpotDetail[] = [
  {
    id: 1,
    name: "児島湾岸浅場",
    coordinate: [34.655, 133.919],
    shortDescription: "シャローの岩礁とウィード",
    description:
      "風を防げる浅場。ウィードエッジをミノーやソフトルアーで軽く攻めるのが効果的。",
    targetFish: ["シーバス", "ヒラメ", "ロックフィッシュ"],
    bestSeason: "春〜秋",
    waterDepth: "0.5m〜2m",
    note: "満ち潮が狙い目。ウェーディングは凪いだ日のみ推奨。",
  },
  {
    id: 2,
    name: "牛窓フェリー乗り場",
    coordinate: [34.61467, 134.16479],
    shortDescription:
      "フェリー乗り場近くから南東に続く護岸一帯で竿出しができる",
    description:
      "外向きで潮がしっかり動くポイント。メタルジグやジグヘッドでボトムを早く取れる。",
    targetFish: ["チヌ", "メバル", "サヨリ"],
    bestSeason: "通年（初夏がピーク）",
    waterDepth: "3m〜8m",
    note: "ライフジャケット必須。夜は小型ルアーが効果的。",
  },
  {
    id: 3,
    name: "吉井川河口サンドフラット",
    coordinate: [34.5805, 133.9455],
    shortDescription: "ベイトが寄る広い砂地",
    description:
      "潮替わりにベイトが寄る広大なフラット。チャネルをロングキャストで探ると反応が出やすい。",
    targetFish: ["ヒラメ", "シーバス"],
    bestSeason: "秋〜冬",
    waterDepth: "1m〜4m",
    note: "干潮時にウェーディングルートを確認。船の往来に注意。",
  },
];

if (isMock) {
  // モック処理
  console.log("モック動作");
}

export const Map = () => {
  const router = useRouter();
  // マップに渡すスポット一覧を同期で用意し、描画のタイミングで揺れないようにする
  const spots = useMemo<FishingSpotSummary[]>(
    () =>
      MOCK_SPOTS.map(({ id, name, coordinate, shortDescription }) => ({
        id,
        name,
        coordinate,
        shortDescription,
      })),
    [],
  );
  // クリックして取得したスポットの詳細
  const [selectedSpot, setSelectedSpot] = useState<FishingSpotDetail | null>(
    null,
  );
  // 詳細取得中のスポットID（同期処理だが状態として保持）
  const [loadingSpotId, setLoadingSpotId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSpotClick = (spotId: number) => {
    // 非同期遅延を挟まず即座に詳細を表示して点滅を防ぐ
    setErrorMessage(null);
    setLoadingSpotId(spotId);

    const detail = MOCK_SPOTS.find((item) => item.id === spotId) ?? null;
    if (!detail) {
      setSelectedSpot(null);
      setErrorMessage("No spot detail found.");
      setLoadingSpotId(null);
      return;
    }

    setSelectedSpot(detail);
    setLoadingSpotId(null);
  };

  const handleMapClick = (latlng: LatLng) => {
    const shouldNavigate = window.confirm(
      "Go to the input form to register a new spot?",
    );

    if (shouldNavigate) {
      router.push(
        `/input-form?lat=${latlng.lat.toFixed(5)}&lng=${latlng.lng.toFixed(5)}`,
      );
    }
  };

  const mapRef = useLeafletMap([34.655, 133.919], {
    enableMarkerPlacement: false,
    spots,
    onSpotClick: handleSpotClick,
    onMapClick: handleMapClick,
  });

  return (
    <div className={styles.container}>
      <div ref={mapRef} className={styles.map} />

      <div className={styles.infoOverlay}>
        <div className={styles.infoTitle}>Fishing Map</div>
        <div>Tap a pin to show detail (mock data).</div>
        <div>Tap the map to confirm navigation to the input form.</div>
        {errorMessage && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}
      </div>

      {selectedSpot && (
        <div className={styles.detailOverlay}>
          <div className={styles.detailTitle}>{selectedSpot.name}</div>
          <div className={styles.shortDescription}>
            {selectedSpot.shortDescription}
          </div>
          <div className={styles.description}>{selectedSpot.description}</div>
          <div className={styles.badges}>
            <Badge label={`Target: ${selectedSpot.targetFish.join(", ")}`} />
            <Badge label={`Season: ${selectedSpot.bestSeason}`} />
            <Badge label={`Depth: ${selectedSpot.waterDepth}`} />
          </div>
          <div className={styles.note}>{selectedSpot.note}</div>
        </div>
      )}

      {loadingSpotId && (
        <div className={styles.loadingOverlay}>Loading pin info...</div>
      )}
    </div>
  );
};

// バッジ表示用の小さなコンポーネント
const Badge = ({ label }: { label: string }) => (
  <span className={styles.badge}>{label}</span>
);
