import mongoose from 'mongoose';
import type { Request, Response } from 'express';
import ChatSchema from '../models/chat.model.ts';
import { Doctor, Patient } from '../models/auth.model.ts';

export const getPatientChatList = async (req: Request, res: Response) => {
  try {
    const patientObjectId = new mongoose.Types.ObjectId(req.user!.id);

    const chats = await ChatSchema.aggregate([
      { $match: { patientId: patientObjectId } },

      // Sort all entries chronologically
      { $sort: { createdAt: -1 } },

      // Group by doctorId to get the latest message for each doctor
      {
        $group: {
          _id: '$doctorId',
          lastMessage: { $last: '$text' },
          lastMessageAt: { $last: '$createdAt' },
          doctorId: { $first: '$doctorId' },
        },
      },

      // Sort chats in ascending order (oldest at top, latest at bottom)
      { $sort: { lastMessageAt: -1 } },
    ]);

    const results = [];

    for (const chat of chats) {
      const doctorId = new mongoose.Types.ObjectId(chat.doctorId);
      const doctor = await Doctor.findOne({ _id: doctorId })
        .select('-password')
        .lean();

      results.push({
        ...chat,
        doctor,
      });
    }

    res.status(200).json({ success: true, results: results });
  } catch (error) {
    console.error('Error in getChatList:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getDoctorChatList = async (req: Request, res: Response) => {
  try {
    const doctorId = new mongoose.Types.ObjectId(req.user!.id);
    debugger;
    const chats = await ChatSchema.aggregate([
      { $match: { doctorId: doctorId } },

      // Sort all entries chronologically
      { $sort: { createdAt: -1 } },

      // Group by doctorId to get the latest message for each doctor
      {
        $group: {
          _id: '$patientId',
          lastMessage: { $last: '$text' },
          lastMessageAt: { $last: '$createdAt' },
          doctorId: { $first: '$patientId' },
        },
      },

      // Sort chats in ascending order (oldest at top, latest at bottom)
      { $sort: { lastMessageAt: -1 } },
    ]);

    debugger;
    const results = [];

    for (const chat of chats) {
      const patientId = new mongoose.Types.ObjectId(chat.patientId);
      const patient = await Patient.findOne({ _id: patientId })
        .select('-password')
        .lean();

      results.push({
        ...chat,
        patient,
      });
    }

    debugger;

    res.status(200).json({ success: true, results: results });
  } catch (error) {
    console.error('Error in getChatList:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 2. Get latest 10 messages between patient (logged-in) and a specific doctor
export const getChatContext = async (req: Request, res: Response) => {
  try {
    const patientId = req.user!.id;
    const { doctorId } = req.params;

    if (!doctorId) {
      return res
        .status(400)
        .json({ success: false, message: 'doctorId is required' });
    }

    const messages = await ChatSchema.find({
      patientId,
      doctorId: doctorId,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const results = [];

    for (const chat of messages) {
      const doctorId = new mongoose.Types.ObjectId(chat.doctorId);
      const doctor = await Doctor.findOne({ _id: doctorId })
        .select('-password')
        .lean();

      results.push({
        ...chat,
        doctor,
      });
    }

    res.status(200).json({ success: true, messages: results });
  } catch (error) {
    console.error('Error in getChatContext:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 3. Doctor sends a message to a patient
export const createChat = async (req: Request, res: Response) => {
  try {
    const { patientId, doctorId, text } = req.body;

    if (!patientId || !doctorId || !text) {
      return res.status(400).json({
        success: false,
        message: 'patientId, doctorId, and text are required',
      });
    }

    const chat = await ChatSchema.create({
      patientId: patientId,
      doctorId: doctorId,
      senderType: 'doctor',
      text,
      createdAt: new Date(),
    });

    res.status(201).json({ success: true, chat });
  } catch (error) {
    console.error('Error in createChat:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const replyChat = async (req: Request, res: Response) => {
  try {
    const { patientId, doctorId, text } = req.body;

    if (!patientId || !doctorId || !text) {
      return res.status(400).json({
        success: false,
        message: 'patientId, doctorId, and text are required',
      });
    }

    const chat = await ChatSchema.create({
      patientId: patientId,
      doctorId: doctorId,
      senderType: 'patient',
      text,
      createdAt: new Date(),
    });

    res.status(201).json({ success: true, chat });
  } catch (error) {
    console.error('Error in createChat:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
