import fs from "fs";

import iconv from "iconv-lite";
import { Parser } from "json2csv";

import { generateEC2Client } from "./generateClient";
import { getCPUArray } from "./getCPUArray";
import { getEC2Instances } from "./getEC2Instances";
import { ClientProps } from "../type/ClientProps";
import { EC2ListItem } from "../type/EC2ListItem";

export const saveCsvEC2 = async (clientProps: ClientProps) => {
  try {
    // EC2クライアントを生成する
    const ec2Client = generateEC2Client(clientProps);

    // EC2インスタンス(CSVのフォーマット：Nameタグの名前、インスタンスID、状態、インスタンスタイプ)の一覧を取得する
    const ec2Instances = await getEC2Instances(ec2Client);

    // 各EC2インスタンスのMaxCPU、AveCPUを取得する
    const ec2MaxCPUArray: number[] = await getCPUArray(
      clientProps,
      "EC2",
      ec2Instances,
      "MAX"
    );
    const ec2AveCPUArray: number[] = await getCPUArray(
      clientProps,
      "EC2",
      ec2Instances,
      "AVE"
    );

    // CSVのフォーマットに整理する
    const ec2List: EC2ListItem[] = [];
    for (const [index, ec2Instance] of ec2Instances.entries()) {
      const ec2InstanceTemp: EC2ListItem = {
        name: ec2Instance.name,
        id: ec2Instance.id,
        status: ec2Instance.status,
        instanceType: ec2Instance.instanceType,
        MaxCPU: ec2MaxCPUArray[index],
        AveCPU: ec2AveCPUArray[index],
      };
      ec2List.push(ec2InstanceTemp);
    }
    const csvFieldsEC2 = [
      "name",
      "id",
      "status",
      "instanceType",
      "MaxCPU",
      "AveCPU",
    ];
    const json2csvParserEC2 = new Parser({
      fields: csvFieldsEC2,
      header: true,
    });
    const csvEC2 = json2csvParserEC2.parse(ec2List);
    fs.writeFileSync("save/ec2_data.csv", iconv.encode(csvEC2, "Shift_JIS"));
    return ec2List;
  } catch (error: unknown) {
    throw new Error();
  }
};
