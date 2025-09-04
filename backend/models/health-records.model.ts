import mongoose from 'mongoose';

const SleepSchema = new mongoose.Schema({
  hours: { type: Number, required: true },
  minutes: { type: Number, required: true },
});

const BloodCountSchema = new mongoose.Schema({
  redBloodCells: { type: Number, required: true },
  whiteBloodCells: { type: Number, required: true },
});

const HealthRecordsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    steps: { type: Number, required: true },
    operations: { type: Number, required: true },
    sleep: { type: SleepSchema, required: true },
    bloodCount: BloodCountSchema,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('HealthRecords', HealthRecordsSchema);