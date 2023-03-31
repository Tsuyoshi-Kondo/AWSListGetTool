// CSVのフォーマット（EC2）
export type EC2ListItem = {
  name: string; // Nameタグに記載された名前
  id: string; // インスタンスID
  status: string; // ステータス
  instanceType: string; // インスタンスタイプ
  MaxCPU?: number; // 直近1ヶ月の最大CPU使用率
  AveCPU?: number; // 直近1ヶ月の平均CPU使用率
};
