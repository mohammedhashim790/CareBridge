import type { Patient } from './patients';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  stillTaking: boolean;
  endDate?: string;
}

interface IntakeForm {
  patientId: string | Patient;
  medications: Medication[];
  createdAt: Date;
  updatedAt: Date;
}

export type {
  Medication,
  IntakeForm,
};