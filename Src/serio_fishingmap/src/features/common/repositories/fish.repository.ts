// src/features/common/repositories/fish.repository.ts
import { randomUUID } from "crypto";
import { BaseRepository } from "./base-repository";
import { ddbDocClient } from "@/lib/dynamodb";
import type { Fish, CreateFishDTO } from "@/types/dto/fish-dto";

type FishKey = { id: string };

const getFishTableName = () => {
  const name = process.env.DYNAMODB_FISH_TABLE_NAME;
  if (!name) throw new Error("DYNAMODB_FISH_TABLE_NAME is not set");
  return name;
};

export const fishRepository: BaseRepository<Fish, CreateFishDTO, FishKey> =
  new BaseRepository<Fish, CreateFishDTO, FishKey>(
    ddbDocClient,
    getFishTableName,
    () => ({ id: randomUUID() }),
    (dto, key) => ({
      ...key,
      ...dto,
      createdAt: new Date().toISOString(),
    })
  );
