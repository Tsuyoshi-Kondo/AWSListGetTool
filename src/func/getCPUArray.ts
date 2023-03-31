import { calcCPU } from "./calcCPU";
import { generateCloudWatchClient } from "./generateClient";
import { generateGetMetricDataCommand } from "./generateGetMetricDataCommand";
import { ClientProps } from "../type/ClientProps";
import { EC2ListItem } from "../type/EC2ListItem";
import { RDSListItem } from "../type/RDSListItem";

// CPU使用率を取得する
export const getCPUArray = async (
  clientProps: ClientProps,
  serviceName: "EC2" | "RDS",
  instances: EC2ListItem[] | RDSListItem[],
  cpuType: "MAX" | "AVE"
) => {
  // CPU使用率を格納する配列
  const CPUArray: number[] = [];
  // 現在時刻を取得
  const nowDate = new Date();
  // CloudWatchクライアントの生成
  const cwClient = generateCloudWatchClient(clientProps);
  try {
    // EC2インスタンスのCPU使用率を算出する
    if (serviceName === "EC2") {
      for (const instance of instances as EC2ListItem[]) {
        // 指定したインスタンスのCPU使用率を含むデータ（MetricDataResults）を取得するコマンドの生成
        const command = generateGetMetricDataCommand(
          "EC2",
          instance.id,
          cpuType,
          nowDate
        );
        // コマンドを実行する
        const { MetricDataResults } = await cwClient.send(command);
        // CPU使用率を算出する
        CPUArray.push(calcCPU(MetricDataResults, cpuType));
      }
    }

    // RDSインスタンスのCPU使用率を算出する
    else {
      for (const instance of instances as RDSListItem[]) {
        // 指定したインスタンスのCPU使用率を含むデータ（MetricDataResults）を取得するコマンドの生成
        const command = generateGetMetricDataCommand(
          "RDS",
          instance.DBInstanceId,
          cpuType,
          nowDate
        );
        // コマンドを実行する
        const { MetricDataResults } = await cwClient.send(command);
        // CPU使用率を算出する
        CPUArray.push(calcCPU(MetricDataResults, cpuType));
      }
    }
    return CPUArray;
  } catch (error) {
    throw new Error();
  }
};
