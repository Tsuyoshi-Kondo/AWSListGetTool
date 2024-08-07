import { MetricDataResult } from "@aws-sdk/client-cloudwatch";

export const calcCPU = (
  MetricDataResults: MetricDataResult[] | undefined,
  cpuType: "MAX" | "AVE"
) => {
  let cpu = -1;
  if (
    MetricDataResults !== undefined && MetricDataResults.length > 0 &&
    MetricDataResults[0].Values!.length !== 0
  ) {
    switch (cpuType) {
      case "MAX":{
        const maxCPUArray: number[] = MetricDataResults[0].Values!;
        // 最大CPU使用率の配列から最も大きい値を取得する
        cpu = maxCPUArray.reduce((num1: number, num2: number) =>
          Math.max(num1, num2)
        );
        break;
      }
      case "AVE":{
        const aveCPUArray: number[] = MetricDataResults[0].Values!;
        // 平均CPU使用率の配列の平均値を取得する
        cpu =
          aveCPUArray.reduce((num1: number, num2: number) => num1 + num2) /
          aveCPUArray!.length;
        break;
      }
    }
  }
  return cpu;
};
