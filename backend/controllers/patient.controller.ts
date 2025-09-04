import type { Request, Response } from 'express';
import { Patient } from '../models/auth.model.ts';

export const    getPatientById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id).select('-password');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(patient);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching patient profile', error: error.message });
  }
};

export const getPatientByPatientId = async (req: Request, res: Response): Promise<any> => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findOne({patientId}).select('-password');
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(patient);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching patient profile', error: error.message });
  }
};



export const getMyPatientProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    // Get patient ID from authenticated user (via JWT)
    const patientId = req.user?.id;
    const patient = await Patient.findById(patientId).select('-password');
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({
      message: 'Patient profile fetched successfully',
      data: patient,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching patient profile', error: error.message });
  }
};

export const updatePatientProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    // Only allow patient to update their own profile
    if (req.user?.role !== 'patient' || req.user.id !== id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updates = req.body;

    const updatedPatient = await Patient.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(updatedPatient);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating patient profile', error: error.message });
  }
};

export const getAllPatients = async (req: Request, res: Response): Promise<any> => {
  try {
    const patients = await Patient.find().select('-password');

    res.status(200).json({
      message: 'All patients fetched successfully',
      data: patients,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching patients', error: error.message });
  }
};
