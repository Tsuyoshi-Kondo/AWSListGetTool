import { DescribeDBInstancesCommand, RDSClient } from "@aws-sdk/client-rds";

import { RDSListItem } from "../type/RDSListItem";

// RDSインスタンス(CSVのフォーマット：Nameタグ、DB識別子、インスタンスタイプ、状態)の一覧を取得する
export const getRDSInstances = async (rdsClient: RDSClient) => {
  // コマンドを生成する
  const command = new DescribeDBInstancesCommand({});

  // RDSインスタンス(csvのフォーマット)の一覧を格納する配列
  const rdsInstances: RDSListItem[] = [];
  try {
    // コマンドを実行してRDSインスタンスの一覧の生データを取得する
    const { DBInstances } = await rdsClient.send(command);

    // 生データがundefinedだった場合はエラーを発生させる
    if (DBInstances === undefined) throw new Error();

    // 生データから必要な情報だけを抽出して、csvのフォーマットに合わせて配列に格納する
    for (const DBInstance of DBInstances) {
      // RDSインスタンス(csvのフォーマット)の一覧の項目1つ分のデータ
      const rdsTemp: RDSListItem = {
        name:
          DBInstance.DBName ??
          (DBInstance.DBInstanceIdentifier + "（Nameタグなし）")!,
        DBInstanceId: DBInstance.DBInstanceIdentifier!,
        instanceType: DBInstance.DBInstanceClass!,
      };
      rdsInstances.push(rdsTemp);
    }
    return rdsInstances;
  } catch (error) {
    throw new Error();
  }
};
