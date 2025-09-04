export interface CreateAppointmentRequestDto {
    doctorId: string
    patientId: string
    appointmentDate: string;  
    phoneNumber?: string;    
    additionalNotes?: string;
}