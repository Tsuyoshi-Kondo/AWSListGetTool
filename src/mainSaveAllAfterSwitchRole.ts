import { AssumeRoleCommand } from "@aws-sdk/client-sts";

import { checkUndefinedForEnv } from "./func/checkUndefinedForEnv";
import { generateSTSClient } from "./func/generateClient";
import { saveCsvEC2 } from "./func/saveCsvEC2";
import { saveCsvRDS } from "./func/saveCsvRDS";
import { ClientProps } from "./type/ClientProps";
import "dotenv/config";


export const main = async () => {
  try {
    // envファイルのアクセスキー、シークレットアクセスキー、リージョンがundefinedでないかチェックする
    checkUndefinedForEnv();

    // 各クライアントを生成するための情報
    const stsClientProps: ClientProps = {
      accessKeyId: process.env.ACCESS_KEY_ID!,
      secretAccessKey: process.env.SECRET_ACCESS_KEY!,
      region: process.env.REGION!,
    };

    // STSクライアントを生成する
    const stsClient = generateSTSClient(stsClientProps);

    // スイッチロール先のIAMロールARNをもとにスイッチ先のアクセスキー等を取得する
    if (process.env.ROLE_ARN === undefined) throw new Error("roleArn is undefined");
    const { Credentials } = await stsClient.send(
      new AssumeRoleCommand({
        // スイッチ先のIAMロールARN
        RoleArn:
          process.env.ROLE_ARN,
        // 任意の名前
        RoleSessionName: "TempSession",
      })
    );

    // 取得したアクセスキー等がundefinedでないかチェックする
    if (Credentials === undefined ||
      Credentials.AccessKeyId === undefined ||
      Credentials.SecretAccessKey === undefined ||
      Credentials.SessionToken=== undefined)
      throw new Error();
    const clientProps: ClientProps = {
      accessKeyId: Credentials.AccessKeyId,
      secretAccessKey: Credentials.SecretAccessKey,
      sessionToken: Credentials.SessionToken,
      region: stsClientProps.region,
    };
    saveCsvEC2(clientProps);
    saveCsvRDS(clientProps);

  } catch (error) {
    throw new Error();
  }
};

main();

