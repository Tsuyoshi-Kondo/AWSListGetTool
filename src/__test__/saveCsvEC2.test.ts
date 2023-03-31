import { checkUndefinedForEnv } from "../func/checkUndefinedForEnv";
import { generateEC2Client } from "../func/generateClient";
import { getCPUArray } from "../func/getCPUArray";
import { getEC2Instances } from "../func/getEC2Instances";
import { saveCsvEC2 } from "../func/saveCsvEC2";
import { EC2ListItem } from "../type/EC2ListItem";

// checkUndefinedForEnv関数をモック化する
jest.mock("../func/checkUndefinedForEnv");
const checkUndefinedForEnvMock = checkUndefinedForEnv as jest.Mock;

// generateEC2Client関数をモック化する
jest.mock("../func/generateClient");
const generateEC2ClientMock = generateEC2Client as jest.Mock;

// getEC2Instances関数をモック化する
jest.mock("../func/getEC2Instances");
const getEC2InstancesMock = getEC2Instances as jest.Mock;

// getCPUArray関数をモック化する
jest.mock("../func/getCPUArray");
const getCPUArrayMock = getCPUArray as jest.Mock;

// EC2インスタンスの一覧のテストデータ
const ec2ListMock: EC2ListItem[] = [
  {
    name: "test-ec2-instance",
    id: "i-aaaaaaaaaaaaaaaaa",
    status: "running",
    instanceType: "t2.micro",
    MaxCPU: 10,
    AveCPU: 5,
  },
  {
    name: "test-ec2-instance2",
    id: "i-bbbbbbbbbbbbbbbbbb",
    status: "running",
    instanceType: "t2.micro",
    MaxCPU: 20,
    AveCPU: 10,
  },
  {
    name: "test-ec2-instance3",
    id: "i-cccccccccccccccccc",
    status: "running",
    instanceType: "t2.micro",
    MaxCPU: 30,
    AveCPU: 15,
  },
];

describe("saveCsvEC2のテスト", () => {
  test("EC2インスタンス・CPU使用率の一覧をCSVで出力する - 正常形", async () => {
    // モック化したcheckUndefinedForEnv関数の返り値を設定する
    checkUndefinedForEnvMock.mockImplementation(() => {
      return jest.fn();
    });

    // モック化したgenerateEC2Client関数の返り値を設定する
    generateEC2ClientMock.mockImplementation(() => {
      return jest.fn();
    });

    // getEC2Instances関数をモック化する
    getEC2InstancesMock.mockImplementation(()=>Promise.resolve(ec2ListMock));

    // getCPUArray関数をモック化する
    getCPUArrayMock
      .mockReturnValueOnce([ec2ListMock[0].MaxCPU, ec2ListMock[1].MaxCPU, ec2ListMock[2].MaxCPU])
      .mockReturnValueOnce([ec2ListMock[0].AveCPU, ec2ListMock[1].AveCPU, ec2ListMock[2].AveCPU]);

    // テスト対象の関数を実行する->saveフォルダのCSVを確認する
    const ec2List = await saveCsvEC2();
    expect(ec2List).toEqual(ec2ListMock);
  });
});
