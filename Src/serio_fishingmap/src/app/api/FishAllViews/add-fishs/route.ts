import { NextResponse } from "next/server";
import { fishRepository } from "@/features/common/repositories/fish.repository";
import type { CreateFishDTO } from "@/types/dto/fish-dto";

/**
 * POST /api/FishAllViews/add-fishs
 * 新しい釣果記録を追加するAPI
 */
export async function POST(request: Request) {
  try {
    const text = await request.text();

    console.log("受信したbody:", text);

    if (!text) {
      return NextResponse.json(
        { error: "リクエストボディが空です" },
        { status: 400 }
      );
    }

    const body = JSON.parse(text) as CreateFishDTO;

    if (!body.fishName) {
      return NextResponse.json(
        { error: "必須項目が不足しています" },
        { status: 400 }
      );
    }

    const newRecord = await fishRepository.create(body);

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error("POST /api/FishAllViews/add-fishs Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
