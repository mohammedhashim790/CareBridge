import {http, type HttpOptions} from "../../interceptor/interceptor";

export class HttpClient {
  constructor() {}

  protected async get<T>(url: string,options?:HttpOptions): Promise<T> {
    const res = await http.get(url,options);
    const data = await res.json();
    if (!res.ok) {
      const error: any = new Error(data.message || 'Request failed');
      error.response = {
        status: res.status,
        data
      };
      throw error;
    }
    return data as T;
  }

  protected async post<T>(url: string, data?: any,options?:HttpOptions): Promise<T> {
    const res = await http.post(url, data, options);
    const responseData = await res.json();
    if (!res.ok) {
      const error: any = new Error(responseData.message || 'Request failed');
      error.response = {
        status: res.status,
        data: responseData
      };
      throw error;
    }
    return responseData as T;
  }

  protected async put<T>(url: string, data?: any,options?:HttpOptions): Promise<T> {
    const res = await http.put(url, data, options);
    const responseData = await res.json();
    if (!res.ok) {
      const error: any = new Error(responseData.message || 'Request failed');
      error.response = {
        status: res.status,
        data: responseData
      };
      throw error;
    }
    return responseData as T;
  }
  protected async delete<T>(url: string,options?: HttpOptions): Promise<T> {
    return http.delete(url,options).then((res) => res.json().then((data) => data as T));
}
}
