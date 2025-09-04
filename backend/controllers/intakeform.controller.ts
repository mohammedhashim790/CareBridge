import type { Request, Response } from 'express';
import IntakeForm from '../models/intakeform.model.ts';

// GET /api/intake-forms/my
export const getMyIntakeForm = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const form = await IntakeForm.findOne({ patientId: userId }).populate({
      path: 'patientId',
      select: '-password',
    });

    if (!form) {
      return res.status(404).json({ error: 'Intake form not found' });
    }

    res.status(200).json({
        message: 'My intake form successfully fetched!',
        data: form
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/intake-forms/:id
export const getIntakeFormById = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.params.id;
    const requester = req.user;

    if (!requester) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Patients can only access their own form
    const isSelf = requester.id === userId;
    const isDoctor = requester.role === 'doctor';

    if (!isSelf && !isDoctor) {
      return res.status(403).json({ error: 'Forbidden: Access denied.' });
    }

    const form = await IntakeForm.findOne({ patientId: userId }).populate({
      path: 'patientId',
      select: '-password',
    });

    if (!form) {
      return res.status(404).json({ error: 'Intake form not found' });
    }

    return res.status(200).json(form);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// POST /api/intake-forms/my
export const createMyIntakeForm = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;

    if (!userId || req.user?.role !== 'patient') {
      return res.status(403).json({ error: 'Only patients can create intake forms.' });
    }

    const existingForm = await IntakeForm.findOne({ patientId: userId });
    if (existingForm) {
      return res.status(400).json({ error: 'Intake form already exists for this patient.' });
    }

    const newForm = new IntakeForm({
      ...req.body,
      patientId: userId,
    });
    const savedForm = await newForm.save();

    return res.status(201).json({
      message: 'Intake form successfully created!',
      data: savedForm,
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

// PUT /api/intake-forms/my
export const updateMyIntakeForm = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const updatedForm = await IntakeForm.findOneAndUpdate(
      { patientId: userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ error: 'No intake form found for this user.' });
    }

    res.status(200).json({
      message: 'Intake form updated successfully.',
      data: updatedForm,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/intake-forms/my
export const deleteMyIntakeForm = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;

    if (!userId || req.user?.role !== 'patient') {
      return res.status(403).json({ error: 'Only patients can delete their own intake forms.' });
    }

    const result = await IntakeForm.findOneAndDelete({ patientId: userId });

    if (!result) {
      return res.status(404).json({ error: 'Intake form not found' });
    }

    return res.status(200).json({
        message: 'Appointment deleted successfully',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};