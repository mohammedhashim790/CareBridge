import mongoose, { Schema } from 'mongoose';

export interface IChat {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  senderType: 'patient' | 'doctor';
  text: string;
  createdAt: Date;
}

const ChatSchema = new Schema<IChat>({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  senderType: { type: String, enum: ['patient', 'doctor'], required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IChat>('Chat', ChatSchema);
