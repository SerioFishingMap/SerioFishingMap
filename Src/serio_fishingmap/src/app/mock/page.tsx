"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CreateFishDTO, Fish } from "@/types/dto/fish-dto";

const isFish = (value: unknown): value is Fish => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const fish = value as Record<string, unknown>;

  return (
    typeof fish.fishID === "number" &&
    typeof fish.fishName === "string" &&
    typeof fish.fishOrder === "string" &&
    typeof fish.category === "string" &&
    typeof fish.createdAt === "string"
  );
};

const isFishList = (value: unknown): value is Fish[] => {
  return Array.isArray(value) && value.every(isFish);
};

export default function MapPage() {
  const router = useRouter();

  const [fishList, setFishList] = useState<Fish[]>([]);
  const [message, setMessage] = useState<string>("");

  const handleBackHome = () => {
    router.push("/");
  };

  // 魚読み込みAPI（GET）
  const handleLoadFish = async () => {
    try {
      setMessage("");

      const res = await fetch("/view-lists/fish-list/get-all-fish-list");

      console.log("取得API status:", res.status);

      const fishData: unknown = await res.json();

      console.log("取得API response:", fishData);

      if (!res.ok) {
        setMessage(`魚一覧の取得に失敗しました: ${String(res.status)}`);
        return;
      }

      if (!isFishList(fishData)) {
        setMessage("魚一覧APIのレスポンス形式が不正です");
        return;
      }

      setFishList(fishData);
      setMessage("魚一覧を取得しました");
    } catch (err) {
      console.error("魚取得エラー", err);
      setMessage("魚一覧の取得中にエラーが発生しました");
    }
  };

  // 魚登録API（POST）
  const handleAddFish = async () => {
    try {
      setMessage("");

      const requestBody: CreateFishDTO = {
        fishID: 1,
        fishName: "ブラックバス",
        fishOrder: "スズキ目",
        category: "淡水魚",
      };

      const res = await fetch("/api/FishAllViews/add-fishs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("登録API status:", res.status);

      const createdFish: unknown = await res.json();

      console.log("登録API response:", createdFish);

      if (!res.ok) {
        setMessage(`魚登録に失敗しました: ${String(res.status)}`);
        return;
      }

      if (!isFish(createdFish)) {
        setMessage("魚登録APIのレスポンス形式が不正です");
        return;
      }

      setMessage("魚データを登録しました");
    } catch (err) {
      console.error("登録エラー", err);
      setMessage("魚登録中にエラーが発生しました");
    }
  };

  return (
    <div>
      <h1>魚管理ページ</h1>

      <button onClick={handleBackHome}>ホームへ戻る</button>

      <br />
      <br />

      <button onClick={handleAddFish}>魚登録APIを実行する</button>

      <br />
      <br />

      <button onClick={handleLoadFish}>魚読み込みAPIを実行する</button>

      <br />
      <br />

      {message && <p>{message}</p>}

      <h3>魚一覧</h3>

      <ul>
        {fishList.map((fish) => (
          <li key={fish.fishID}>
            {fish.fishID} - {fish.fishName} - {fish.fishOrder} - {fish.category}
          </li>
        ))}
      </ul>
    </div>
  );
}
