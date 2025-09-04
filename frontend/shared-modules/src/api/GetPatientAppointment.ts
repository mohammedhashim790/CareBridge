import type { PatientInformationResponseDto } from "../dtos/patientInformation/PatientResponseDto";
import {HttpClient} from "./HttpClient";

export class GetPatientAppointment extends HttpClient {
    baseUrl: string

    constructor(baseURL: string) {
        super();
        this.baseUrl = baseURL;
    }

    async getAllPatientAppointment(patientId?: string): Promise<PatientInformationResponseDto>{
        return this.get<PatientInformationResponseDto>(`${this.baseUrl}/appointments/patient/${patientId}`);
    }
}