import { checkUndefinedForEnv } from "../func/checkUndefinedForEnv";

describe("checkUndefinedForClientPropsのテスト", () => {
  // 環境変数の初期化用の変数
  const env: NodeJS.ProcessEnv = process.env;

  // 各テストケースの実行前に実行される処理
  beforeEach(() => {
    // キャッシュを削除する
    jest.resetModules();
    // 環境変数を初期化する
    process.env = { ...env };
  });

  test("envファイル中のアクセスキー・シークレットキー・リージョンがundefinedではない場合、エラーを発生させない - 正常形", async () => {
    process.env.ACCESS_KEY_ID = "****";
    process.env.SECRET_ACCESS_KEY = "****";
    process.env.REGION = "****";

    // エラーが発生しないことを確認する
    expect(() => checkUndefinedForEnv()).not.toThrow();
  });

  test("envファイル中のアクセスキーがundefinedの場合、エラーを発生させる - 準正常形", async () => {
    process.env.SECRET_ACCESS_KEY = "****";
    process.env.REGION = "****";

    expect(() => checkUndefinedForEnv()).toThrow("accessKeyId is undefined");
  });

  test("envファイル中のシークレットキーがundefinedの場合、エラーを発生させる - 準正常形", async () => {
    process.env.ACCESS_KEY_ID = "****";
    process.env.REGION = "****";

    expect(() => checkUndefinedForEnv()).toThrow(
      "secretAccessKey is undefined"
    );
  });

  test("envファイル中のリージョンがundefinedの場合、エラーを発生させる - 準正常形", async () => {
    process.env.ACCESS_KEY_ID = "****";
    process.env.SECRET_ACCESS_KEY = "****";

    expect(() => checkUndefinedForEnv()).toThrow("region is undefined");
  });
});
