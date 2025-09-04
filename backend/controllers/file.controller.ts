import type { Request, Response } from 'express';
import FileSchema from '../models/file.model.ts';

export const createFile = async (req: Request, res: Response) => {
  try {
    const { doctorId, patientId, name, key, bucket, fileType, note } = req.body;

    const file = new FileSchema({
      doctorId,
      patientId,
      name,
      key,
      bucket,
      fileType,
      note,
    });

    await file.save();
    console.log(`File created for patient ${patientId} by doctor ${doctorId}`);

    res.status(201).json({ message: 'File created successfully', file });
  } catch (error) {
    // @ts-ignore
    console.log('Error creating file:', error);
    res.status(500).json({ message: 'One or more fields are missing' });
  }
};

export const getFilesByPatient = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    let files: any = await FileSchema.find({ patientId })
      .sort({
        createdAt: -1,
      })
      .lean();
    files = files.splice(0, 3);
    res.status(200).json({ files });
  } catch (error) {
    // @ts-ignore
    console.log('Error fetching files:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
