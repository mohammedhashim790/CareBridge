import { HttpClient } from './HttpClient';
import { getAuthToken } from '../user_auth/user_auth';
import type {
  BloodCountChartData,
  HealthRecords,
  HealthRecordsPostData,
} from '../types/health-records';

class HealthRecordsService extends HttpClient {
  baseUrl: string;

  constructor(baseURL: string) {
    super();
    this.baseUrl = baseURL;
  }

  async getAllMyHealthRecords(): Promise<HealthRecords[]> {
      const res = await this.get<{ message: string; data: HealthRecords[] }>(
        this.baseUrl + '/health-records/my/all',
        { token: getAuthToken() ?? undefined },
      );

      return res.data;
  }

  async getMyHealthRecordsForToday(): Promise<HealthRecords> {
    const res = await this.get<{ message: string; data: HealthRecords }>(
      this.baseUrl + '/health-records/my/today', 
      { token: getAuthToken() ?? undefined },
    );

    return res.data;
  }

  async getMyBloodCount(): Promise<BloodCountChartData> {
    const res = await this.get<{ message: string; data: BloodCountChartData }>(
      this.baseUrl + '/health-records/my/blood', 
      { token: getAuthToken() ?? undefined },
    );

    console.log(res);

    return res.data;
  }

  async createMyHealthRecords(data: HealthRecordsPostData): Promise<HealthRecords> {
    const res = await this.post<{ message: string; data: HealthRecords }>(
      this.baseUrl + '/health-records/my',
      data,
      { token: getAuthToken() ?? undefined },
    );

    return res.data;
  }
}

export const healthRecordsService = new HealthRecordsService('https://wckhbleqhi.execute-api.ca-central-1.amazonaws.com/prod/api');
