
export interface Drug {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
}

export interface DoctorContact {
    address?: string;
    telephone: string;
    registrationNumber: string;
}

export interface PharmacyInfo {
    name: string;
    sharedAt: Date;
}

export interface PrescriptionFormValues {
    patientName: string;
    issueDate: string;
    drugs: Drug[];
    doctorName: string;
    doctorContact: DoctorContact;
    notes: string;
    signature: string;
    sharedWithPharmacy: PharmacyInfo;
}
