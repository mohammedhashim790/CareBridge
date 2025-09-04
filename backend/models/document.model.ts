import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
    fileType: { type: String },
    fileSize: { type: Number },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true},
});

const MedicalDocument = mongoose.model('MedicalDocument', documentSchema);

export default MedicalDocument;