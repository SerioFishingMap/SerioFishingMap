import { fishRepository } from "@/features/common/repositories/fish.repository";
import type { Fish } from "@/types/dto/fish-dto";

export async function getAllFishList(): Promise<Fish[]> {
  const records = await fishRepository.getAll();
  return records;
}
