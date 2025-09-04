import mongoose, { Schema } from 'mongoose';

export interface IBioMarkers {
  heartRate: string;
  height: string;
  weight: number;
  bloodGroup: string;
  allergies: Array<string>;
  pastIllness?: string;
  patientId: mongoose.Schema.Types.ObjectId;
}

const BioMarkersSchema = new Schema<IBioMarkers>({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  heartRate: { type: String, required: true },
  height: { type: String, required: true },
  weight: { type: Number, required: true },
  bloodGroup: { type: String, required: true },
  allergies: { type: [], required: true },
  pastIllness: { type: String, required: false },
});

export default mongoose.model<IBioMarkers>('BioMarkers', BioMarkersSchema);
