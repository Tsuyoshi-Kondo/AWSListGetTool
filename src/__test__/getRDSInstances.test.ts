import { RDSClient } from "@aws-sdk/client-rds";

import { getRDSInstances } from "../func/getRDSInstances";
import { RDSListItem } from "../type/RDSListItem";

// RDSClientクラスをモック化する
jest.mock("@aws-sdk/client-rds");
const RDSClientMock = RDSClient as jest.Mock;

// RDSインスタンスの一覧のテストデータ
const rdsListMock: RDSListItem[] = [
  {
    name: "タグ1",
    DBInstanceId: "test-rds-instance",
    instanceType: "db.t2.micro",

  },
  {
    name: "タグ2",
    DBInstanceId: "test-rds-instance2",
    instanceType: "db.t2.micro",
  },
  {
    name: "タグ3",
    DBInstanceId: "test-rds-instance3",
    instanceType: "db.t2.micro",
  },
];

// モック化したRDSClientクラスのsend関数の返り値を設定する
RDSClientMock.mockImplementation(() => {
  return {
    send: jest.fn(async () => {
      return {
        DBInstances: [
          {
            DBInstanceIdentifier: rdsListMock[0].DBInstanceId,
            DBInstanceClass: rdsListMock[0].instanceType,
            DBName: rdsListMock[0].name,
          },
          {
            DBInstanceIdentifier: rdsListMock[1].DBInstanceId,
            DBInstanceClass: rdsListMock[1].instanceType,
            DBName: rdsListMock[1].name,
          },
          {
            DBInstanceIdentifier: rdsListMock[2].DBInstanceId,
            DBInstanceClass: rdsListMock[2].instanceType,
            DBName: rdsListMock[2].name,
          },
        ],
      };
    }),
  };
});

describe("getRDSInstancesのテスト", () => {
  test("RDSクライアントを引数としてRDSインスタンスの一覧を取得して返す - 正常形", async () => {
    // モック化したRDSClientクラスのインスタンスを生成する
    const rdsClientMock = new RDSClientMock();

    // テスト対象の関数を実行する
    const rdsInstances = await getRDSInstances(rdsClientMock);

    // テスト対象の返り値がテストデータと一致するか確認する
    expect(rdsInstances).toEqual([
      rdsListMock[0],
      rdsListMock[1],
      rdsListMock[2],
    ]);
  });

  test("rds2Client.send関数の返り値がundefinedの場合エラーを発生させる - 準正常形", async () => {
    // モック化したRDSClientクラスのインスタンスを生成する
    const rdsClientMock = new RDSClientMock();

    // モック化したEC2Clientクラスのsend関数の返り値をundefinedに設定する
    rdsClientMock.send = jest.fn(async () => {
      return undefined;
    });

    // テスト対象の関数を実行してエラーが発生することを確認する
    await expect(getRDSInstances(rdsClientMock)).rejects.toThrow();
  });
});
