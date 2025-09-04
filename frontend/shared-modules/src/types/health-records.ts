export interface Sleep {
  hours: number;
  minutes: number;
}

export interface BloodCount {
  redBloodCells: number;
  whiteBloodCells: number;
}

export interface HealthRecords {
  readonly userId: string;
  steps: number;
  operations: number;
  sleep: Sleep;
  bloodCount?: BloodCount;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type HealthRecordsPostData = Omit<HealthRecords, 'userId' | 'createdAt' | 'updatedAt'>;

export interface BloodCountChartData extends BloodCount {
  date: string;
  month: string;
}