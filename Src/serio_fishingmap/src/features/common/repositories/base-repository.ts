// src/features/common/repositories/base-repository.ts
import type { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { ScanCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

type BuildKey<C, K> = (input: C) => K;
type BuildItem<T, C, K> = (input: C, key: K) => T;

type DynamoKey = Record<string, unknown>;
type TableNameProvider = string | (() => string);

export class BaseRepository<T, C, K extends DynamoKey> {
  constructor(
    private readonly client: DynamoDBDocumentClient,
    private readonly tableNameProvider: TableNameProvider,
    private readonly buildKey: BuildKey<C, K>,
    private readonly buildItem: BuildItem<T, C, K>
  ) {}

  private tableName(): string {
    const name =
      typeof this.tableNameProvider === "function"
        ? this.tableNameProvider()
        : this.tableNameProvider;

    if (!name) throw new Error("tableName is required");
    return name;
  }

  async getAll(): Promise<T[]> {
    const res = await this.client.send(
      new ScanCommand({ TableName: this.tableName() })
    );

    const items = (res.Items ?? []) as T[];
    return items;
  }

  async getById(key: K): Promise<T | null> {
    const res = await this.client.send(
      new GetCommand({ TableName: this.tableName(), Key: key })
    );

    return (res.Item as T) ?? null;
  }

  async create(input: C): Promise<T> {
    const key = this.buildKey(input);
    const item = this.buildItem(input, key);

    await this.client.send(
      new PutCommand({
        TableName: this.tableName(),
        Item: item as Record<string, unknown>,
      })
    );

    return item;
  }
}
