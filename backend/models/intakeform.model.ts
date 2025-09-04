import mongoose, { Schema } from 'mongoose';

const MedicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  startDate: { type: Date, required: true },
  stillTaking: { type: Boolean, required: true },
  endDate: { 
    type: Date, 
    required: function(this: any) { return !this.stillTaking; },
  },
}, { _id: false });

const IntakeFormSchema = new mongoose.Schema({
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  medications: [MedicationSchema],
}, {
  timestamps: true,
});

export default mongoose.model('IntakeForm', IntakeFormSchema);