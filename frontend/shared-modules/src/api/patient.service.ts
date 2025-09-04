import {HttpClient} from "./HttpClient";
import {getAuthToken} from "../user_auth/user_auth";


export class PatientService extends HttpClient {
    baseUrl: string;

    constructor(baseURL: string) {
        super();
        this.baseUrl = baseURL;
    }

    async getPatient(patientId: string): Promise<any> {
        return await this.get(this.baseUrl + `/patients/detail/${patientId}`, {
            token: getAuthToken() as any
        });
    }

}
