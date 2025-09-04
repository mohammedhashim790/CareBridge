import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

const doctorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    street: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    postalCode: { type: String, required: false },
    country: { type: String, required: false },
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  specialization: {
    type: String,
    required: true,
    trim: true,
  },
  doctorId: { type: String, unique: true },
  resetPasswordOtp: { type: String },
  resetPasswordExpires: { type: Date },
});

const patientSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
  patientId: { type: String, unique: true },
  resetPasswordOtp: { type: String },
  resetPasswordExpires: { type: Date },
  createdBy: { type: Array, default: [] },
});

doctorSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

patientSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

doctorSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

patientSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

const Doctor = mongoose.model('Doctor', doctorSchema, 'doctors');
const Patient = mongoose.model('Patient', patientSchema, 'patients');

export { Doctor, Patient };

export interface PatientDoc extends Document {
  address: any;
  _id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  phone: string;
  gender: 'male' | 'female' | 'other';
  patientId: string;
  createdBy: [string];
  // address?: {
  //   street: string;
  //   city: string;
  //   state: string;
  //   postalCode: string;
  //   country: string;
  // } | null;
}
