import type { PatientGender } from './gender';

export type Address = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type Patient = {
  _id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO date string
  phone: string;
  address: Address;
  gender: PatientGender;
};

export type MyPatient = Patient & {
  lastAppointmentDate: string; // ISO date string
  additionalNote: string;
}