import { HttpClient } from "./HttpClient";
import type { CreateAppointmentRequestDto } from "../dtos/appointment/CreateAppointmentRequestDto";
import type { AppointmentResponseDto } from "../dtos/appointment/CreateAppointmentResponseDto";

export class AppointmentApi extends HttpClient {
  baseUrl: string;

  constructor(baseURL: string) {
    super();
    this.baseUrl = baseURL;
  }

  createAppointment(data: CreateAppointmentRequestDto): Promise<AppointmentResponseDto> {
    return this.post<AppointmentResponseDto>(`${this.baseUrl}/appointments`, data);
  }
  
  getAppointments(): Promise<AppointmentResponseDto[]> {
    return this.get<AppointmentResponseDto[]>(`${this.baseUrl}/appointments`);
  }
}
