import type { NextFunction, Request, Response } from 'express';
import { Appointment } from '../models/appointment.model.ts';
import { AppointmentStatusList } from '../constants/appointmentStatus.ts';
import {
  isDoctorExistsByDoctorId,
  isPatientExistsByPatientId,
} from '../utils/validateExistence.ts';
import { Doctor, Patient } from '../models/auth.model.ts';
import { scheduleMeeting } from './meeting.controller.ts';

export const getAllAppointments = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const appointments = await Appointment.find();
    return res.status(200).json(appointments);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAppointmentById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate(
      'patientId doctorId'
    );
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    return res.status(200).json(appointment);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const createAppointment = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { patientId, doctorId, appointmentDate, phoneNumber, additionalNotes } =
    req.body;

  if (!patientId || !doctorId || !appointmentDate) {
    return res.status(400).json({
      message: 'Patient ID, Doctor ID, and Appointment Date are required',
    });
  }

  // Validate ISO 8601 format and ensure date is not in the past
  const date = new Date(appointmentDate);
  if (isNaN(date.getTime()) || date < new Date()) {
    return res
      .status(400)
      .json({ message: 'Invalid or past appointment date' });
  }

  try {
    if (
      !(await isDoctorExistsByDoctorId(doctorId)) ||
      !(await isPatientExistsByPatientId(patientId))
    ) {
      return res.status(400).json({
        message: 'Doctor or Patient with the given ID does not exist',
      });
    }

    const scheduledMeeting = await scheduleMeeting({
      userId: patientId,
      scheduledTime: appointmentDate,
    });

    const newAppointment = new Appointment({
      patientId,
      doctorId,
      appointmentDate,
      patientPhoneNumber: phoneNumber || null,
      additionalNotes: additionalNotes || null,
      status: 'scheduled',
      meetingId: scheduledMeeting.meeting._id,
      token: scheduledMeeting.meeting.token,
    });

    const savedAppointment = await newAppointment.save();
    return res.status(201).json({
      message: scheduledMeeting.message,
      meeting: scheduledMeeting.meeting,
      appointment: savedAppointment,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateAppointment = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { status, ...updateFields } = req.body;

    const existingAppointment = await Appointment.findById(req.params.id);

    // Check if the appointment exists
    if (!existingAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if doctorId or patientId is being changed
    if (
      updateFields.doctorId !== existingAppointment.doctorId ||
      updateFields.patientId !== existingAppointment.patientId
    ) {
      return res.status(400).json({
        message: 'Cannot change doctorId or patientId of an appointment',
      });
    }

    // Manual validation for status field
    if (
      updateFields.status &&
      !AppointmentStatusList.includes(updateFields.status)
    ) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        status: status,
        ...updateFields,
      },
      {
        new: true,
        runValidators: true,
        context: 'query', // Enable enum validation
      }
    ).populate('patientId doctorId');

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    return res.status(200).json(updatedAppointment);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: error.message });
  }
};

export const deleteAppointment = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(
      req.params.id
    );

    if (!deletedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    return res
      .status(200)
      .json({ message: 'Appointment deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAppointmentsByPatientId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { patientId } = req.params;

  try {
    // 1. Find patient by custom patientId
    const patient = await Patient.findOne({ patientId }).select('-password');
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // 2. Find appointments where patientId matches (not _id)
    let appointments: any = await Appointment.find({ patientId })
      .populate('meetingId')
      .lean();

    const results = [];

    for (let appointment of appointments) {
      const doctorId = appointment.doctorId;
      const doctor = await Doctor.find({ doctorId }).lean();
      if (doctor) appointment.doctor = doctor[0];
      else appointment.doctor = {};
      results.push(appointment);
    }

    // 3. Respond with both
    return res.status(200).json({
      patient,
      appointments: results,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: 'Failed to fetch patient or appointments',
      error: err.message,
    });
  }
};
