import { checkUndefinedForEnv } from "./func/checkUndefinedForEnv";
import { saveCsvRDS } from "./func/saveCsvRDS";
import { ClientProps } from "./type/ClientProps";
import "dotenv/config";

try {
  // envファイルのアクセスキー、シークレットアクセスキー、リージョンがundefinedでないかチェックする
  checkUndefinedForEnv();

  // 各クライアントを生成するための情報
  const clientProps: ClientProps = {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
    region: process.env.REGION!,
  };
  saveCsvRDS(clientProps);
}
catch (error) {
  console.error(error);
}

