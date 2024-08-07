import { GetMetricDataCommand } from "@aws-sdk/client-cloudwatch";

// 指定したインスタンスの直近1ヶ月のCPU（最大or平均）使用率を取得するコマンドを生成する
export const generateGetMetricDataCommand = (
  serviceName: "EC2" | "RDS",
  id: string,
  cpuType: "MAX" | "AVE",
  nowDate: Date
) => {
  // 現在時刻をコピー
  const nowDateCopy = new Date(nowDate);
  // 1ヶ月前の日付を取得
  const date1MonthBeforeFromNow = new Date(
    nowDateCopy.setMonth(nowDateCopy.getMonth() - 1)
  );
  let nameSpace = "";
  let name = "";
  if (serviceName === "EC2") {
    nameSpace = "AWS/EC2";
    name = "InstanceId";
  } else {
    nameSpace = "AWS/RDS";
    name = "DBInstanceIdentifier";
  }
  let stat = "";
  if (cpuType === "MAX") {
    stat = "Maximum";
  } else {
    stat = "Average";
  }
  const command = new GetMetricDataCommand({
    MetricDataQueries: [
      {
        Id: "demoMetricsQuery",
        MetricStat: {
          Metric: {
            Namespace: nameSpace,
            MetricName: "CPUUtilization",
            Dimensions: [
              {
                Name: name,
                Value: id,
              },
            ],
          },
          Period: 86400, // 1日ごとにCPU使用率を取得する
          Unit: "Percent",
          Stat: stat,
        },
      },
    ],
    StartTime: date1MonthBeforeFromNow,
    EndTime: nowDate,
  });

  return command;
};
