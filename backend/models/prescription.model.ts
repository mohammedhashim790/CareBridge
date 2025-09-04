import mongoose, { Schema, Document } from 'mongoose';

export interface IMedication {
  name: string;
  dosage: string;
  frequency: string;
}

export interface IPrescription extends Document {
  doctorId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  medications: IMedication[];
  notes?: string;
  createdAt: Date;
  sharedWithPharmacy?: {
    name: string;
    sharedAt: Date;
  } | null;
}

const MedicationSchema = new Schema<IMedication>({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
});

const PrescriptionSchema = new Schema<IPrescription>({
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  medications: { type: [MedicationSchema], required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  sharedWithPharmacy: {
    type: {
      name: { type: String },
      sharedAt: { type: Date },
    },
    default: null,
  },
});

export default mongoose.model<IPrescription>('Prescription', PrescriptionSchema);
