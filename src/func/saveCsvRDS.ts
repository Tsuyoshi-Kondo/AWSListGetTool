import fs from "fs";

import iconv from "iconv-lite";
import { Parser } from "json2csv";

import { checkUndefinedForEnv } from "./checkUndefinedForEnv";
import { generateRDSClient } from "./generateClient";
import { getCPUArray } from "./getCPUArray";
import { getRDSInstances } from "./getRDSInstances";
import { ClientProps } from "../type/ClientProps";
import { RDSListItem } from "../type/RDSListItem";
import "dotenv/config";

export const saveCsvRDS = async () => {
  try {
    // envファイルのアクセスキー、シークレットアクセスキー、リージョンがundefinedでないかチェックする
    checkUndefinedForEnv();

    // 各クライアントを生成するための情報
    const clientProps: ClientProps = {
      accessKeyId: process.env.ACCESS_KEY_ID!,
      secretAccessKey: process.env.SECRET_ACCESS_KEY!,
      region: process.env.REGION!,
    };

    // RDSクライアントを生成する
    const rdsClient = generateRDSClient(clientProps);

    // RDSインスタンス(CSVのフォーマット：Nameタグ、DB識別子、インスタンスタイプ、状態)の一覧を取得する
    const rdsInstances = await getRDSInstances(rdsClient);

    // 各RDSインスタンスのMaxCPU、AveCPUを取得する
    const rdsMaxCPUArray: number[] = await getCPUArray(
      clientProps,
      "RDS",
      rdsInstances,
      "MAX"
    );
    const rdsAveCPUArray: number[] = await getCPUArray(
      clientProps,
      "RDS",
      rdsInstances,
      "AVE"
    );

    // CSVのフォーマットに整理する
    const rdsList: RDSListItem[] = [];
    for (const [index, rdsInstance] of rdsInstances.entries()) {
      const rdsInstanceTemp: RDSListItem = {
        name: rdsInstance.name,
        DBInstanceId: rdsInstance.DBInstanceId,
        instanceType: rdsInstance.instanceType,
        MaxCPU: rdsMaxCPUArray[index],
        AveCPU: rdsAveCPUArray[index],
      };
      rdsList.push(rdsInstanceTemp);
    }
    const csvFieldsRDS = [
      "name",
      "DBInstanceId",
      "instanceType",
      "MaxCPU",
      "AveCPU",
    ];
    const json2csvParserRDS = new Parser({
      fields: csvFieldsRDS,
      header: true,
    });
    const csvRDS = json2csvParserRDS.parse(rdsList);
    fs.writeFileSync("save/rds_data.csv", iconv.encode(csvRDS, "Shift_JIS"));
    return rdsList;
  } catch (error: unknown) {
    console.log(error);
  }
};

saveCsvRDS();
