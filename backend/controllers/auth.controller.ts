import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Doctor, Patient } from '../models/auth.model.ts';
import { validationResult } from 'express-validator';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const generateCustomId = (prefix: string): string => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}${randomNum}`;
};

const generateToken = (user: any) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      licenseNumber: user.licenseNumber ?? '',
      specialization: user.specialization ?? '',
      role: user instanceof Doctor ? 'doctor' : 'patient',
      customId: user.patientId ?? user.doctorId,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );
};

export const registerDoctor = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      email,
      password,
      firstName,
      lastName,
      phone, // address,
      licenseNumber,
      specialization,
    } = req.body;

    const existingEmail = await Doctor.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const existingLicense = await Doctor.findOne({ licenseNumber });
    if (existingLicense) {
      return res.status(400).json({ message: 'License number already exists' });
    }

    const doctor = new Doctor({
      email,
      password,
      firstName,
      lastName,
      phone, // address,
      licenseNumber,
      specialization,
      doctorId: generateCustomId('DOC'),
    });

    await doctor.save();
    const token = generateToken(doctor);

    res.status(201).json({
      token,
      user: {
        id: doctor._id,
        email: doctor.email,
        role: 'doctor',
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        doctorId: doctor.doctorId,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const registerPatient = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      address,
      dateOfBirth,
      gender,
    } = req.body;

    const existingEmail =
      (await Patient.findOne({ email })) || (await Doctor.findOne({ email }));
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const createdBy = [];

    if (req.user !== undefined) createdBy.push(req.user.id);

    const patient = new Patient({
      email,
      password,
      firstName,
      lastName,
      phone,
      address,
      dateOfBirth,
      gender,
      patientId: generateCustomId('PAT'),
      createdBy: createdBy,
    });

    await patient.save();
    const token = generateToken(patient);

    res.status(201).json({
      token,
      user: {
        id: patient._id,
        email: patient.email,
        role: 'patient',
        firstName: patient.firstName,
        lastName: patient.lastName,
        patientId: patient.patientId,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });
    const patient = await Patient.findOne({ email });

    if (!doctor && !patient) {
      return res.status(400).json({ message: 'Username not found' });
    }

    const user = doctor || patient;
    if (!user) {
      return res.status(400).json({ message: 'Username not found' });
    }
    const isMatch = await (user as any).comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    const isDoctor = user instanceof Doctor;
    const customId =
      isDoctor && 'doctorId' in user
        ? (user as any).doctorId
        : 'patientId' in user
          ? (user as any).patientId
          : null;

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user instanceof Doctor ? 'doctor' : 'patient',
        firstName: user.firstName,
        lastName: user.lastName,
        customId,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const Model = req.user?.role === 'doctor' ? Doctor : Patient;
    const user = await (Model as typeof Doctor)
      .findById(req.user?.id)
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const logout = (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Logout successful. Please clear the token on the client side.',
  });
};

// POST /api/auth/forgot-password
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email } = req.body;
    const doctor = await Doctor.findOne({ email });
    const patient = await Patient.findOne({ email });

    if (!doctor && !patient) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = doctor || (patient as any);
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash the OTP for security
    user.resetPasswordOtp = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');
    user.resetPasswordExpires = Date.now() + 600000; // 10 minutes expiration
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>You have requested to reset your password. Please use the following OTP to proceed:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #333; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p><strong>This OTP will expire in 10 minutes.</strong></p>
          <p>If you didn't request this password reset, please ignore this email.</p>
        </div>
      `,
      text: `Your password reset OTP is: ${otp}\nThis OTP expires in 10 minutes.`,
    });

    res.status(200).json({ 
      message: 'Password reset OTP sent to your email.',
      // Optional: Include email (partially masked) for confirmation
      email: email.replace(/(.{2})(.*)(@.*)/, '$1****$3')
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/auth/verify-otp
export const verifyOtp = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, otp } = req?.body;

    if (!email || !otp) {
      return res.status(400).json({ 
        message: 'Email and OTP are required' 
      });
    }

    const hashedOtp = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');

    const doctor = await Doctor.findOne({
      email,
      resetPasswordOtp: hashedOtp,
      resetPasswordExpires: { $gt: Date.now() },
    });
    
    const patient = await Patient.findOne({
      email,
      resetPasswordOtp: hashedOtp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    const user = doctor || patient;
    
    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid OTP or OTP has expired' 
      });
    }

    res.status(200).json({ 
      message: 'OTP verified successfully',
      verified: true 
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/auth/reset-password
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, otp, newPassword } = req.body;

    // Validate input
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ 
        message: 'Email, OTP, and new password are required' 
      });
    }

    // Hash the provided OTP to compare with stored hash
    const hashedOtp = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');

    // Find user with matching email, OTP, and valid expiration
    const doctor = await Doctor.findOne({
      email,
      resetPasswordOtp: hashedOtp,
      resetPasswordExpires: { $gt: Date.now() },
    });
    
    const patient = await Patient.findOne({
      email,
      resetPasswordOtp: hashedOtp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    const user = doctor || (patient as any);
    
    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid OTP or OTP has expired' 
      });
    }

    // Update password and clear reset fields
    user.password = newPassword; // Make sure your model has password hashing middleware
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ 
      message: 'Password has been reset successfully',
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};