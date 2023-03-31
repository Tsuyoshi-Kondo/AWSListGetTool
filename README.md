# AWSインスタンスリストアップツール

EC2・RDSのインスタンス一覧と各インスタンスの直近1ヶ月の  
最大・平均CPU使用率が記載されたCSVを出力します。

## Installation & exec  
```
  # インストール
  $ npm install --production

  # クローンしたプロジェクトの直下にenvファイルを新規作成し、
  # アクセスキー・シークレットキー・リージョンを記載する

  # 以下コマンドでEC2一覧のCSVがsaveフォルダに保存される
  npm run saveEC2

  # 以下コマンドでRDS一覧のCSVがsaveフォルダに保存される
  npm run saveRDS

```
