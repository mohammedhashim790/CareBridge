import { HttpClient } from '../api/HttpClient';
import type { IntakeForm, Medication } from '../types/intake-form';

class IntakeFormService extends HttpClient {
  async getMyIntakeForm(): Promise<IntakeForm> {
    const res = await this.get<{ message: string; data: IntakeForm }>('https://wckhbleqhi.execute-api.ca-central-1.amazonaws.com/prod/api/intake-forms/my');
    return res.data;
  }

  async getIntakeFormById(id: string): Promise<IntakeForm> {
    const res = await this.get<{ message: string; data: IntakeForm }>('https://wckhbleqhi.execute-api.ca-central-1.amazonaws.com/prod/api/intake-forms/' + id);
    return res.data;
  }

  async createIntakeForm(payload: Medication[]): Promise<IntakeForm> {
    const res = await this.post<{ message: string; data: IntakeForm }>('https://wckhbleqhi.execute-api.ca-central-1.amazonaws.com/prod/api/intake-forms/my', {
      medications: payload,
    });
    return res.data;
  }

  async updateIntakeForm(payload: Partial<IntakeForm>): Promise<IntakeForm> {
    const res = await this.put<{ message: string; data: IntakeForm }>('https://wckhbleqhi.execute-api.ca-central-1.amazonaws.com/prod/api/intake-forms/my', payload);
    return res.data;
  }

  async deleteIntakeForm(): Promise<void> {
    await this.delete('https://wckhbleqhi.execute-api.ca-central-1.amazonaws.com/prod/api/intake-forms/my');
  }
}

export const intakeFormService = new IntakeFormService();
