import { DescribeInstancesCommand, EC2Client } from "@aws-sdk/client-ec2";

import { EC2ListItem } from "../type/EC2ListItem";

// EC2インスタンス(CSVのフォーマット：Nameタグの名前、インスタンスID、状態、インスタンスタイプ)の一覧を取得する
export const getEC2Instances = async (ec2Client: EC2Client) => {
  // RUNNING状態のインスタンスの一覧を取得するコマンドを生成する
  const command = new DescribeInstancesCommand({
    Filters: [{ Name: "instance-state-name", Values: ["running"] }],
  });

  // EC2インスタンス(csvのフォーマット)の一覧を格納する配列
  const ec2Instances: EC2ListItem[] = [];
  try {
    // コマンドを実行してEC2インスタンスの一覧の生データを取得する
    const { Reservations } = await ec2Client.send(command);

    // 生データがundefinedだった場合はエラーを発生させる
    if (Reservations === undefined) throw new Error();

    // 生データから必要な情報だけを抽出して、csvのフォーマットに合わせて配列に格納する
    for (const reservation of Reservations) {
      // タグが設定されていない場合は、「Nameタグなし」を設定する
      // タグが設定されている場合は、タグの中でキーがNameの値を設定する
      let name = "Nameタグなし";
      if (reservation.Instances![0].Tags !== undefined) {
        for (const tagItem of reservation.Instances![0].Tags) {
          if (tagItem.Key === "Name") name = tagItem.Value!;
        }
      }
      // EC2インスタンス(csvのフォーマット)の一覧の項目1つ分のデータ
      const ec2Temp: EC2ListItem = {
        name,
        id: reservation.Instances![0].InstanceId!,
        status: reservation.Instances![0].State!.Name!,
        instanceType: reservation.Instances![0].InstanceType!,
      };
      ec2Instances.push(ec2Temp);
    }
    return ec2Instances;
  } catch (error) {
    throw new Error();
  }
};
