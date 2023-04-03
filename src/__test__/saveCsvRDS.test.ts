import { checkUndefinedForEnv } from "../func/checkUndefinedForEnv";
import { generateRDSClient } from "../func/generateClient";
import { getCPUArray } from "../func/getCPUArray";
import { getRDSInstances } from "../func/getRDSInstances";
import { saveCsvRDS } from "../func/saveCsvRDS";
import { ClientProps } from "../type/ClientProps";
import { RDSListItem } from "../type/RDSListItem";

// checkUndefinedForEnv関数をモック化する
jest.mock("../func/checkUndefinedForEnv");
const checkUndefinedForEnvMock = checkUndefinedForEnv as jest.Mock;

// generateRDSClient関数をモック化する
jest.mock("../func/generateClient");
const generateRDSClientMock = generateRDSClient as jest.Mock;

// getRDSInstances関数をモック化する
jest.mock("../func/getRDSInstances");
const getRDSInstancesMock = getRDSInstances as jest.Mock;

// getCPUArray関数をモック化する
jest.mock("../func/getCPUArray");
const getCPUArrayMock = getCPUArray as jest.Mock;

// RDSインスタンスの一覧のテストデータ
const rdsListMock: RDSListItem[] = [
  {
    name: "タグ1",
    DBInstanceId: "test-rds-instance",
    instanceType: "db.t2.micro",
    MaxCPU: 10,
    AveCPU: 5,
  },
  {
    name: "タグ2",
    DBInstanceId: "test-rds-instance2",
    instanceType: "db.t2.micro",
    MaxCPU: 20,
    AveCPU: 10,
  },
  {
    name: "タグ3",
    DBInstanceId: "test-rds-instance3",
    instanceType: "db.t2.micro",
    MaxCPU: 30,
    AveCPU: 15,
  },
];

const clientPropsMock: ClientProps = {
  accessKeyId: "********",
  secretAccessKey: "********",
  region: "********",
};

describe("saveCsvRDSのテスト", () => {
  test("RDSインスタンス・CPU使用率の一覧をCSVで出力する - 正常形", async () => {
    // モック化したcheckUndefinedForEnv関数の返り値を設定する
    checkUndefinedForEnvMock.mockImplementation(() => {
      return jest.fn();
    });

    // モック化したgenerateRDSClient関数の返り値を設定する
    generateRDSClientMock.mockImplementation(() => {
      return jest.fn();
    });

    // getRDSInstances関数をモック化する
    getRDSInstancesMock.mockImplementation(()=>Promise.resolve(rdsListMock));

    // getCPUArray関数をモック化する
    getCPUArrayMock
      .mockReturnValueOnce([rdsListMock[0].MaxCPU, rdsListMock[1].MaxCPU, rdsListMock[2].MaxCPU])
      .mockReturnValueOnce([rdsListMock[0].AveCPU, rdsListMock[1].AveCPU, rdsListMock[2].AveCPU]);

    // テスト対象の関数を実行する->saveフォルダのCSVを確認する
    const rdsList = await saveCsvRDS(clientPropsMock);
    expect(rdsList).toEqual(rdsListMock);
  });
});
