"use client";

import L from "leaflet";
import { useEffect, useRef } from "react";
// Leaflet CSS is globally imported via src/app/globals.css
// import "leaflet/dist/leaflet.css";
//  import { Coordinate } from "@/utils/type";
/** 緯度・経度を表す型 */
export type Coordinate = [number, number];
// またはオブジェクト型でも可：
// export interface Coordinate { lat: number; lng: number; }

type UseLeafletMapOptions = {
  /** マップ上でクリックしたときにマーカーを置けるか */
  enableMarkerPlacement?: boolean;
  /** 表示するスポット一覧（マーカーを設置する） */
  spots?: MapSpot[];
  /** マーカー選択時のコールバック */
  onSpotClick?: (spotId: number) => void;
  /** マップ上クリック時のコールバック（ピン追加など） */
  onMapClick?: (latlng: L.LatLng) => void;
};

export type MapSpot = {
  id: number;
  name: string;
  coordinate: Coordinate;
  shortDescription?: string;
};

// マップ用のカスタムマーカー（public/where_to_vote.svg）を使う
const fishingSpotIcon = L.icon({
  iconUrl: "/where_to_vote.svg",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -28],
  tooltipAnchor: [0, -26],
  // Leaflet既定の影画像をCDN経由で利用。ローカルに置く場合はpublic配下に置き換えてください。
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

/**
 * 指定座標を中心としたLeafletマップをセットアップし、コンテナのrefとマップインスタンスを返す。
 * enableMarkerPlacementがtrueの場合はクリック位置に座標付きのマーカーを表示する。
 */
const useLeafletMap = (
  center: Coordinate,
  {
    enableMarkerPlacement = false,
    spots = [],
    onSpotClick,
    onMapClick,
  }: UseLeafletMapOptions = {},
) => {
  /** マップを描画するDOM要素の参照 */
  const mapRef = useRef<HTMLDivElement>(null);
  /** Leafletマップのインスタンス */
  const mapInstanceRef = useRef<L.Map | null>(null);
  /** マーカーレイヤー */
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;
    // すでに初期化済みなら位置調整だけ行い、マップの新規作成処理をスキップする
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center);
    } else {
      // 指定中心座標・ズームでマップインスタンスを作成
      const map = L.map(mapRef.current).setView(center, 13);
      mapInstanceRef.current = map;

      // OSMタイルを読み込み
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
    }

    // アンマウント時にイベント解除とインスタンス破棄
    return () => {
      markersLayerRef.current?.clearLayers();
      // mapInstanceRef が存在する場合のみ破棄を実行
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersLayerRef.current = null;
    };
  }, [center]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleClick = (event: L.LeafletMouseEvent) => {
      // ユーザ側で処理したい場合
      onMapClick?.(event.latlng);

      if (enableMarkerPlacement) {
        const marker = L.marker(event.latlng).addTo(map);
        marker
          .bindPopup(
            `Lat: ${event.latlng.lat.toFixed(5)}, Lng: ${event.latlng.lng.toFixed(
              5,
            )}`,
          )
          .openPopup();
      }
    };

    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [enableMarkerPlacement, onMapClick]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersLayerRef.current ??= L.layerGroup().addTo(map);

    const layer = markersLayerRef.current;
    layer.clearLayers();

    if (!spots.length) return;

    spots.forEach((spot) => {
      const marker = L.marker(spot.coordinate, {
        title: spot.name,
        icon: fishingSpotIcon,
      });
      if (spot.shortDescription) {
        marker.bindTooltip(spot.shortDescription);
      }
      marker.on("click", () => onSpotClick?.(spot.id));
      marker.addTo(layer);
    });

    // クリーンアップでマーカーをまとめて掃除
    return () => {
      layer.clearLayers();
    };
  }, [spots, onSpotClick]);

  return mapRef;
};

export { useLeafletMap };
