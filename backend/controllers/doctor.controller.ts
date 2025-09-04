import type { Request, Response } from 'express';
import type { PatientDoc } from '../models/auth.model.ts';
import { Doctor, Patient } from '../models/auth.model.ts';
import type { AppointmentDoc } from '../models/appointment.model.ts';
import { Appointment } from '../models/appointment.model.ts';

export const getMyDoctorProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    // Get doctor ID from authenticated user (via JWT)
    const doctorId = req.user?.id;
    const doctor = await Doctor.findById(doctorId).select('-password');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json({
      message: 'Doctor profile fetched successfully',
      data: doctor,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Error fetching doctor profile', error: error.message });
  }
};

export const getDoctorById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id).select('-password');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json({
      message: 'Doctor profile fetched successfully',
      data: doctor,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Error fetching doctor profile', error: error.message });
  }
};

export const updateDoctorProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    // Only allow doctor to update their own profile
    if (req.user?.role !== 'doctor' || req.user?.id !== id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updates = req.body;

    const updatedDoctor = await Doctor.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updatedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json({
      message: 'Doctor profile updated successfully',
      data: updatedDoctor,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Error updating doctor profile', error: error.message });
  }
};

export const getMyPatients = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const doctorId = req.user?.id;

    // Step 1: Fetch all appointments for the doctor and populate patient info
    const appointments = await Appointment.find<AppointmentDoc>({ doctorId })
      .populate<{ patientId: PatientDoc }>('patientId', '-password') // populate full patient info, exclude password
      .sort({ date: -1 }); // sort by date descending (latest first)

    if (!appointments.length) {
      return res
        .status(200)
        .json({ message: 'No patients found for this doctor', data: [] });
    }

    const uniquePatientsMap = new Map();

    for (const appointment of appointments) {
      const patient = appointment.patientId;

      // Only store the first (latest) appointment per patient
      if (!uniquePatientsMap.has(patient._id.toString())) {
        uniquePatientsMap.set(patient._id.toString(), {
          _id: patient._id,
          firstName: patient.firstName,
          lastName: patient.lastName,
          dateOfBirth: patient.dateOfBirth,
          phone: patient.phone,
          address: patient.address,
          gender: patient.gender,
          lastAppointmentDate: appointment.appointmentDate.toString(),
          additionalNote: appointment.additionalNote || 'N/A',
        });
      }
    }

    return res.status(200).json({
      message: 'Patients with latest appointment info fetched successfully',
      data: Array.from(uniquePatientsMap.values()),
    });
  } catch (error: any) {
    console.error('Error in getMyPatients:', error);
    return res.status(500).json({
      message: 'Error fetching patients for doctor',
      error: error.message,
    });
  }
};

export const getMyPatientsList = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const doctorId = req.user?.id;

    const result = await Patient.find({ createdBy: { $in: doctorId } }).select(
      '-password'
    );

    return res.status(200).json({
      data: Array.from(result),
    });
  } catch (error: any) {
    debugger;
    console.error('Error in getMyPatients:', error);
    return res.status(500).json({
      message: 'Error fetching patients for doctor',
      error: error.message,
    });
  }
};
