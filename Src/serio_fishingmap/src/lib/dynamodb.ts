import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// 開発環境またはテスト環境かどうかを判定します
// 'npm run dev' の場合は process.env.NODE_ENV が 'development' になります
const isLocal = process.env.NODE_ENV === 'development' || process.env.JEST_WORKER_ID !== undefined;

let clientConfig = {};

// 開発環境またはテスト環境の場合、ローカルのDynamoDB設定を使用します
if (isLocal) {
  clientConfig = {
    endpoint: 'http://localhost:8000',
    region: 'local-env', // ローカル用のダミーリージョン
    credentials: {
      accessKeyId: 'fakeMyKeyId', // TODO: のちに設定するため、今はローカル用のダミーアクセスキーを設定している。
      secretAccessKey: 'fakeSecretAccessKey', // ローカル用のダミーシークレット
    },
  };
} else {
  // 本番環境用の設定（Vercelなどにデプロイした場合）
  // この場合、IAMロールなどで認証情報が自動的に設定されることを想定
  clientConfig = {
    region: 'ap-northeast-1', // ここはご自身のAWSリージョンに合わせてください
  };
}

const client = new DynamoDBClient(clientConfig);

export const ddbDocClient = DynamoDBDocumentClient.from(client);