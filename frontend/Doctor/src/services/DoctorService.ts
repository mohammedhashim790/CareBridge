// apps/doctor/src/services/DoctorService.ts
import { HttpClient } from 'shared-modules/src/api/HttpClient';
import type { MyPatient } from '../types/patients/patient';

class DoctorService extends HttpClient {
  getMyPatients(): Promise<MyPatient[]> {
    return this.get<{ message: string; data: MyPatient[] }>('https://wckhbleqhi.execute-api.ca-central-1.amazonaws.com/prod/api/doctors/mypatients')
      .then(res => res.data);
  }
}

export const doctorService = new DoctorService();
