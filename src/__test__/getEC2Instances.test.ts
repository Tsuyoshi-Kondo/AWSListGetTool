import { EC2Client } from "@aws-sdk/client-ec2";

import { getEC2Instances } from "../func/getEC2Instances";
import { EC2ListItem } from "../type/EC2ListItem";

// EC2Clientクラスをモック化する
jest.mock("@aws-sdk/client-ec2");
const EC2ClientMock = EC2Client as jest.Mock;

// EC2インスタンスの一覧のテストデータ
const ec2ListMock: EC2ListItem[] = [
  {
    name: "test-ec2-instance",
    id: "i-aaaaaaaaaaaaaaaaa",
    status: "running",
    instanceType: "t2.micro",
  },
  {
    name: "test-ec2-instance2",
    id: "i-bbbbbbbbbbbbbbbbbb",
    status: "running",
    instanceType: "t2.micro",
  },
  {
    name: "test-ec2-instance3",
    id: "i-cccccccccccccccccc",
    status: "running",
    instanceType: "t2.micro",
  },
];

// モック化したEC2Clientクラスのsend関数の返り値を設定する
EC2ClientMock.mockImplementation(() => {
  return {
    send: jest.fn(async () => {
      return {
        Reservations: [
          {
            Instances: [
              {
                InstanceId: ec2ListMock[0].id,
                InstanceType: ec2ListMock[0].instanceType,
                State: { Name: ec2ListMock[0].status },
                Tags: [
                  { Key: "Description", Value: "説明文" },
                  { Key: "Name", Value: ec2ListMock[0].name },
                ],
              },
            ],
          },
          {
            Instances: [
              {
                InstanceId: ec2ListMock[1].id,
                InstanceType: ec2ListMock[1].instanceType,
                State: { Name: ec2ListMock[1].status },
                Tags: [{ Key: "Name", Value: ec2ListMock[1].name }],
              },
            ],
          },
          {
            Instances: [
              {
                InstanceId: ec2ListMock[2].id,
                InstanceType: ec2ListMock[2].instanceType,
                State: { Name: ec2ListMock[2].status },
                Tags: [{ Key: "Name", Value: ec2ListMock[2].name }],
              },
            ],
          },
        ],
      };
    }),
  };
});

describe("getEC2Instancesのテスト", () => {
  test("EC2クライアントを引数としてEC2インスタンスの一覧を取得して返す - 正常形", async () => {
    // モック化したEC2Clientクラスのインスタンスを生成する
    const ec2ClientMock = new EC2ClientMock();

    // テスト対象の関数を実行する
    const ec2Instances = await getEC2Instances(ec2ClientMock);

    // テスト対象の返り値がテストデータと一致するか確認する
    expect(ec2Instances).toEqual([
      ec2ListMock[0],
      ec2ListMock[1],
      ec2ListMock[2],
    ]);
  });

  test("ec2Client.send関数の返り値がundefinedの場合エラーを発生させる - 準正常形", async () => {
    // モック化したEC2Clientクラスのインスタンスを生成する
    const ec2ClientMock = new EC2ClientMock();

    // モック化したEC2Clientクラスのsend関数の返り値をundefinedに設定する
    ec2ClientMock.send = jest.fn(async () => {
      return undefined;
    });

    // テスト対象の関数を実行してエラーが発生することを確認する
    await expect(getEC2Instances(ec2ClientMock)).rejects.toThrow();
  });
});
