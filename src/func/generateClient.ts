import { CloudWatchClient } from "@aws-sdk/client-cloudwatch";
import { EC2Client } from "@aws-sdk/client-ec2";
import { RDSClient } from "@aws-sdk/client-rds";

import { ClientProps } from "../type/ClientProps";

// EC2系のコマンドを実行するためのEC2Clientを生成する
export const generateEC2Client = (clientProps: ClientProps) => {
  const ec2Client = new EC2Client({
    credentials: {
      accessKeyId: clientProps.accessKeyId,
      secretAccessKey: clientProps.secretAccessKey,
    },
    region: clientProps.region,
  });
  return ec2Client;
};

// RDS系のコマンドを実行するためのRDSClientを生成する
export const generateRDSClient = (clientProps: ClientProps) => {
  const rdsClient = new RDSClient({
    credentials: {
      accessKeyId: clientProps.accessKeyId,
      secretAccessKey: clientProps.secretAccessKey,
    },
    region: clientProps.region,
  });
  return rdsClient;
};

// CloudWatch系のコマンドを実行するためのCloudWatchClientを生成する
export const generateCloudWatchClient = (clientProps: ClientProps) => {
  const cwClient = new CloudWatchClient({
    credentials: {
      accessKeyId: clientProps.accessKeyId,
      secretAccessKey: clientProps.secretAccessKey,
    },
    region: clientProps.region,
  });
  return cwClient;
};
