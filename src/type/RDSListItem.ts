// CSVのフォーマット（RDS）
export type RDSListItem = {
  name: string; // Nameタグに記載された名前
  DBInstanceId: string; // DB識別子
  instanceType: string; // インスタンスタイプ
  MaxCPU?: number; // 直近1ヶ月の最大CPU使用率
  AveCPU?: number; // 直近1ヶ月の平均CPU使用率
};
