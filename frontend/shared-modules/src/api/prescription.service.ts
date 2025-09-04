import {HttpClient} from "./HttpClient";
import {getAuthToken} from "../user_auth/user_auth";


export class Prescription extends HttpClient {
    baseUrl: string;

    constructor(baseURL: string) {
        super();
        this.baseUrl = baseURL;
    }

    async list(patientId: string): Promise<any> {
        return await this.get(this.baseUrl + `/prescriptions/${patientId}`, {
            token: getAuthToken() as any
        });
    }


    async create(data: any): Promise<any> {
        return await this.post(this.baseUrl + `/prescriptions/`, data, {
            token: getAuthToken() as any
        });
    }

}
