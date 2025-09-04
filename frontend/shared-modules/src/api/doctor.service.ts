import {HttpClient} from "./HttpClient";
import {getAuthToken} from "../user_auth/user_auth";


export class DoctorService extends HttpClient {
    baseUrl: string;

    constructor(baseURL: string) {
        super();
        this.baseUrl = baseURL;
    }

    async getMyPatientList(): Promise<any> {
        return await this.get(this.baseUrl + `/doctors/myPatientsList`, {
            token: getAuthToken() as any
        });
    }

}
