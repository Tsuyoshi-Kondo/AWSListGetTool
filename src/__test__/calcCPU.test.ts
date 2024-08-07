import { MetricDataResult } from "@aws-sdk/client-cloudwatch";

import { calcCPU } from "../func/calcCPU";

describe("calcCPUのテスト", () => {
  test("メトリックデータ（タイムスタンプの配列とCPU最大使用率の配列）を受け取り、最大CPU使用率の配列から最も大きい値を取得して最大CPU使用率として返す - 正常形", async () => {
    const MetricDataResults: MetricDataResult[] = [
      {
        Id: "CPU",
        Label: "CPUUtilization",
        Timestamps: [
          new Date("2021-01-01T00:00:00Z"),
          new Date("2021-01-01T00:01:00Z"),
          new Date("2021-01-01T00:02:00Z"),
          new Date("2021-01-01T00:03:00Z"),
          new Date("2021-01-01T00:04:00Z"),
          new Date("2021-01-01T00:05:00Z"),
          new Date("2021-01-01T00:06:00Z"),
          new Date("2021-01-01T00:07:00Z"),
          new Date("2021-01-01T00:08:00Z"),
          new Date("2021-01-01T00:09:00Z"),
        ],
        Values: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        StatusCode: "Complete",
      },
    ];
    const cpuType = "MAX";
    const cpu = calcCPU(MetricDataResults, cpuType);
    expect(cpu).toBe(1.0);
  });

  test("メトリックデータを受け取り、平均CPU使用率の配列の平均値を計算して平均CPU使用率として返す - 正常形", async () => {
    const MetricDataResults: MetricDataResult[] = [
      {
        Id: "CPU",
        Label: "CPUUtilization",
        Timestamps: [
          new Date("2021-01-01T00:00:00Z"),
          new Date("2021-01-01T00:01:00Z"),
          new Date("2021-01-01T00:02:00Z"),
          new Date("2021-01-01T00:03:00Z"),
          new Date("2021-01-01T00:04:00Z"),
          new Date("2021-01-01T00:05:00Z"),
          new Date("2021-01-01T00:06:00Z"),
          new Date("2021-01-01T00:07:00Z"),
          new Date("2021-01-01T00:08:00Z"),
          new Date("2021-01-01T00:09:00Z"),
        ],
        Values: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        StatusCode: "Complete",
      },
    ];
    const cpuType = "AVE";
    const cpu = calcCPU(MetricDataResults, cpuType);
    expect(cpu).toBe(0.55);
  });

  test("受け取ったメトリックデータがundefinedの場合、CPU最大（平均）使用率として-1を返す - 準正常形", async () => {
    const MetricDataResults: MetricDataResult[] | undefined = undefined;
    const cpuType = "MAX";
    const cpu = calcCPU(MetricDataResults, cpuType);
    expect(cpu).toBe(-1);
  });
});
