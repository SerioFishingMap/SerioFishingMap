"use client";

import { useEffect, useState } from "react";
import { CustomCardGroup } from "@/components/elements/Card/CardGroup";
import { FilterChipGroup } from "@/components/elements/filter-chip/FilterChipGroup";
import { Label } from "@/components/elements/Label/Label";

// TODO: テストデータ
type BaseCard = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
};

type CardWithObjectUrl = BaseCard & {
  imageObjectUrl: string;
};

const cardData: BaseCard[] = [
  {
    id: 1,
    title: "Card 1",
    description: "説明1",
    imageUrl: "https://picsum.photos/300/200?random=1",
  },
  {
    id: 2,
    title: "Card 2",
    description: "説明2",
    imageUrl: "https://picsum.photos/300/200?random=2",
  },
  {
    id: 3,
    title: "Card 3",
    description: "説明3",
    imageUrl: "https://picsum.photos/300/200?random=3",
  },
];

export default function FishListPage() {
  const [cards, setCards] = useState<CardWithObjectUrl[]>([]);

  useEffect(() => {
    let disposed = false;
    const objectUrls: string[] = [];

    const loadImages = async () => {
      const withBlobs: CardWithObjectUrl[] = await Promise.all(
        cardData.map(async (item) => {
          const res = await fetch(item.imageUrl);
          const blob = await res.blob();
          const objectUrl = URL.createObjectURL(blob);

          objectUrls.push(objectUrl);

          return { ...item, imageObjectUrl: objectUrl };
        })
      );

      if (!disposed) {
        setCards(withBlobs);
      } else {
        objectUrls.forEach((url) => {
          URL.revokeObjectURL(url);
        });
      }
    };

    void loadImages();

    return () => {
      disposed = true;
      objectUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonValue[]
    | { [key: string]: JsonValue };

  const [data, setData] = useState<JsonValue | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/testApi");
        const json: unknown = await response.json();
        setData(json as JsonValue);
      } catch (error: unknown) {
        console.error("Error fetching data:", error);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // data が null の場合（API失敗など）
  if (data === null) {
    return <div>Failed to load data.</div>;
  }

  return (
    <div>
      <Label text="魚一覧" size="title" />
      <FilterChipGroup
        options={["React", "Next.js", "Chakra UI", "TypeScript"]}
        defaultSelected={["React"]}
        onChange={(selected) => {
          console.log("選択されたタグ:", selected);
        }}
      />
      <CustomCardGroup items={cards} />
    </div>
  );
}
