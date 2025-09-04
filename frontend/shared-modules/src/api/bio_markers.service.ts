import {HttpClient} from "./HttpClient";
import {getAuthToken} from "../user_auth/user_auth";


export class BioMarkersService extends HttpClient {
    baseUrl: string;

    constructor(baseURL: string) {
        super();
        this.baseUrl = baseURL;
    }

    async getBioMarker(): Promise<any> {
        return await this.get(this.baseUrl + `/bio`, {
            token: getAuthToken() as any
        });
    }

    async getBioMarkerByPatientId(patientId: string): Promise<any> {
        return await this.get(this.baseUrl + `/bio/${patientId}`, {
            token: getAuthToken() as any
        });
    }


    async createBioMarker(data: any): Promise<any> {
        return await this.post(this.baseUrl + `/bio`, data, {
            token: getAuthToken() as any
        });
    }


}
