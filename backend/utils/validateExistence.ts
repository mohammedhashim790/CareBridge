import { Doctor, Patient } from '../models/auth.model.ts';

export const isDoctorExists = async (doctorId: string): Promise<boolean> => {
  const doctor = await Doctor.findById(doctorId);

  return !!doctor;
};

export const isDoctorExistsByDoctorId = async (
  doctorId: string
): Promise<boolean> => {
  const doctor = await Doctor.find({ doctorId });
  return !!doctor;
};

export const isPatientExistsByPatientId = async (
  patientId: string
): Promise<boolean> => {
  const patient = await Patient.find({ patientId });

  return !!patient;
};

export const isPatientExists = async (patientId: string): Promise<boolean> => {
  const patient = await Patient.findById(patientId);

  return !!patient;
};
