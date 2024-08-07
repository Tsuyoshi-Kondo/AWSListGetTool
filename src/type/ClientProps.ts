// 各クライアントを生成する際の引数の型
export type ClientProps = {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
  region: string;
};
