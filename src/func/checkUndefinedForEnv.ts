// envファイル中のアクセスキー・シークレットキー・リージョンがundefinedかどうかをチェックする
export const checkUndefinedForEnv = () => {
  if (process.env.ACCESS_KEY_ID === undefined) {
    throw new Error("accessKeyId is undefined");
  }
  if (process.env.SECRET_ACCESS_KEY === undefined) {
    throw new Error("secretAccessKey is undefined");
  }
  if (process.env.REGION === undefined) {
    throw new Error("region is undefined");
  }
};
