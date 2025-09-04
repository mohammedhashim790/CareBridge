export interface PatientInformationResponseDto {
    patient: {
      _id: string;
      email: string;
      firstName: string;
      lastName: string;
      phone: string;
      dateOfBirth: string;
      gender: string;
      patientId: string;
      address: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
      };
      __v: number;
    };
    appointments: {
      _id: string;
      patientId: string;
      doctorId: string;
      appointmentDate: string;
      status: 'scheduled' | 'completed' | 'cancelled';
      createdAt: string;
      updatedAt: string;
      __v: number;
    }[];
  }
  