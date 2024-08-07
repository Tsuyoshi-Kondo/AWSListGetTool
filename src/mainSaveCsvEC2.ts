import { checkUndefinedForEnv } from "./func/checkUndefinedForEnv";
import { saveCsvEC2 } from "./func/saveCsvEC2";
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
  saveCsvEC2(clientProps);
}
catch (error) {
  console.log(error);
}



