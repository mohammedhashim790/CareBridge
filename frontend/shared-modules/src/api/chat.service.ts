import {HttpClient} from "./HttpClient";
import {getAuthToken} from "../user_auth/user_auth";


export class ChatService extends HttpClient {
    baseUrl: string;

    constructor(baseURL: string) {
        super();
        this.baseUrl = baseURL;
    }

    async getChatContext(doctorId: string): Promise<any> {
        return await this.get(this.baseUrl + `/chat/get/${doctorId}`, {
            token: getAuthToken() as any
        });
    }

    async getChatList(): Promise<any> {
        return await this.get(this.baseUrl + `/chat/list`, {
            token: getAuthToken() as any
        });
    }


    async create(data: {
        doctorId: string, patientId: string, text: string,
    }): Promise<any> {
        return await this.post(this.baseUrl + `/chat/create`, data, {
            token: getAuthToken() as any
        });
    }

    async reply(data: {
        doctorId: string, patientId: string, text: string,
    }): Promise<any> {
        return await this.post(this.baseUrl + `/chat/reply`, data, {
            token: getAuthToken() as any
        });
    }




}
