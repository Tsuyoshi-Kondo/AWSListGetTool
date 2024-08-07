import { CloudWatchClient } from "@aws-sdk/client-cloudwatch";

import { calcCPU } from "../func/calcCPU";
import { getCPUArray } from "../func/getCPUArray";
import { ClientProps } from "../type/ClientProps";
import { EC2ListItem } from "../type/EC2ListItem";
import { RDSListItem } from "../type/RDSListItem";
import "dotenv/config";

// CloudWatchClientクラスをモック化する
jest.mock("@aws-sdk/client-cloudwatch");
const CloudWatchClientMock = CloudWatchClient as jest.Mock;

// calcCPU関数をモック化する
jest.mock("../func/calcCPU");
const calcCPUMock = calcCPU as jest.Mock;

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

// テスト対象の引数のモック（クライアント生成に使用する情報のモック）
const clientProps: ClientProps = {
  accessKeyId: "accessKeyId",
  secretAccessKey: "secretAccessKey",
  region: "region",
};

beforeEach(() => {
  // モック化したCloudWatchClientクラスのsend関数の返り値を設定する
  CloudWatchClientMock.mockImplementation(() => {
    return {
      send: jest.fn(async () => {
        return {
          MetricDataResults: [
            {
              Id: "cwClient.sendMock",
              Label: "CPUUtilization",
              Values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            },
          ],
        };
      }),
    };
  });

  // モック化したcalcCPUMock関数の返り値を設定する
  calcCPUMock
    .mockReturnValueOnce(10)
    .mockReturnValueOnce(20)
    .mockReturnValueOnce(30);
});

describe("getCPUArrayのテスト", () => {
  test("EC2インスタンスの一覧を受け取り、最大CPU使用率を返す - 正常形", async () => {
    // テスト対象を実行する
    const CPUArray = await getCPUArray(clientProps, "EC2", ec2ListMock, "MAX");

    // getCPUArrayの中のcalcCPU関数の前までの処理が呼び出されていて、
    // テスト対象のgetCPUArrayがcalcCPU関数モックが返す値と同じ値を返しているか確認する
    expect(CPUArray).toEqual([10, 20, 30]);
  });

  test("EC2インスタンスの一覧を受け取り、平均CPU使用率を返す - 正常形", async () => {
    const CPUArray = await getCPUArray(clientProps, "EC2", ec2ListMock, "AVE");
    expect(CPUArray).toEqual([10, 20, 30]);
  });

  test("RDSインスタンスの一覧を受け取り、最大CPU使用率を返す - 正常形", async () => {
    const CPUArray = await getCPUArray(clientProps, "RDS", rdsListMock, "MAX");
    expect(CPUArray).toEqual([10, 20, 30]);
  });

  test("RDSインスタンスの一覧を受け取り、平均CPU使用率を返す - 正常形", async () => {
    const CPUArray = await getCPUArray(clientProps, "RDS", rdsListMock, "AVE");
    expect(CPUArray).toEqual([10, 20, 30]);
  });

  test("cwClientインスタンスのsend関数でエラーが発生した場合、エラーを発生させる - 準正常形", async () => {
    // モック化したCloudWatchClientMockのsend関数の返り値を設定する
    CloudWatchClientMock.mockImplementation(() => {
      return {
        send: jest.fn(async () => {
          throw new Error();
        }),
      };
    });
    // テスト対象を実行する
    await expect(
      getCPUArray(clientProps, "EC2", ec2ListMock, "MAX")
    ).rejects.toThrow();
  });
});
