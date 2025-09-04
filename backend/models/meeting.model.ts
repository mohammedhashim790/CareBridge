import mongoose, { Document, Schema } from 'mongoose';

export interface IMeeting extends Document {
  _id: string; // meetingId becomes the _id
  userId: string;
  scheduledTime: Date;
}

const MeetingSchema: Schema = new Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true },
    scheduledTime: { type: Date, required: true },
    token: { type: String, required: true },
  },
  { _id: false }
);

export default mongoose.model<IMeeting>('Meeting', MeetingSchema);
