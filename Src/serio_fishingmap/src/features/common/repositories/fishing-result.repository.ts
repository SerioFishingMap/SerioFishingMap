import {
  ScanCommand,
  PutCommand,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  FishingResult,
  CreateFishingResultDTO,
} from "../../../types/dto/fishing-result-dto";
import { ddbDocClient } from "@/lib/dynamodb";

const TABLE_NAME = process.env.DYNAMODB_FISH_TABLE_NAME;

class FishingResultRepository {
  /**
   * すべての釣果記録を取得する
   */
  async getAll(): Promise<FishingResult[]> {
    const command = new ScanCommand({ TableName: TABLE_NAME });
    const response = await ddbDocClient.send(command);

    const items = response.Items ?? [];
    return items as FishingResult[];
  }

  /**
   * IDで単一の釣果記録を取得する
   */
  async getById(id: string): Promise<FishingResult | undefined> {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    });
    const response = await ddbDocClient.send(command);
    return response.Item as FishingResult | undefined;
  }

  /**
   * 新しい釣果記録を作成する
   */
  async create(recordData: CreateFishingResultDTO): Promise<FishingResult> {
    const newItem: FishingResult = {
      FishingResultID: await this.generateFishingResultID(),
      ...recordData,
      createdAt: new Date().toISOString(),
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: newItem,
    });

    await ddbDocClient.send(command);
    return newItem;
  }

  private async generateFishingResultID(): Promise<number> {
    const command = new UpdateCommand({
      TableName: "Counters",
      Key: { PK: "FishingResultID" },
      UpdateExpression: "ADD currentValue :inc",
      ExpressionAttributeValues: {
        ":inc": 1,
      },
      ReturnValues: "UPDATED_NEW",
    });
    const result = await ddbDocClient.send(command);
    const nextValue = result.Attributes?.currentValue;

    if (typeof nextValue !== "number") {
      throw new Error(
        `Failed to generate FishingResultID. Counter item missing or invalid. Attributes=${JSON.stringify(
          result.Attributes
        )}`
      );
    }

    return nextValue;
  }
}

// FishResultRepositoryのインスタンスを作成してエクスポート
// これにより、他のファイルからは new FishingResultRepository() せずにすぐ使える
export const fishingResultRepository = new FishingResultRepository();
