import {HttpClient} from "./HttpClient";
import {getAuthToken} from "../user_auth/user_auth";


export class FileService extends HttpClient {
    baseUrl: string;

    constructor(baseURL: string) {
        super();
        this.baseUrl = baseURL;
    }

    async getFilesByPatient(patientId: string): Promise<any> {
        return await this.get(this.baseUrl + `/files/${patientId}`, {
            token: getAuthToken() as any
        });
    }

    async create(data: {
        doctorId: string,
        patientId: string,
        name: string,
        key: string,
        bucket: string,
        note?:string,
        fileType:string,
    }): Promise<any> {
        return await this.post(this.baseUrl + `/files`, data, {
            token: getAuthToken() as any
        });
    }


}
