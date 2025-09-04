import mongoose, { Document, Types } from 'mongoose';
import type { PatientDoc } from './auth.model.ts';
import { AppointmentStatusList } from '../constants/appointmentStatus.ts';

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.String,
      ref: 'Patient',
      required: true,
    },
    doctorId: {
      type: String,
      ref: 'Doctor',
      required: true,
    },
    appointmentDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: AppointmentStatusList,
      default: 'scheduled',
    },
    additionalNote: {
      type: String,
      trim: true,
    },
    meetingId: {
      type: String,
      ref: 'Meeting',
      required: false,
    },
    token: {
      type: String,
      ref: 'Meeting',
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

export { Appointment };

export interface AppointmentDoc extends Document {
  _id: string;
  patientId: string | string;
  doctorId: string | string;
  appointmentDate: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  additionalNote?: string;
  meetingId?: string;
  createdAt: Date;
  updatedAt: Date;
  token: string | string
}