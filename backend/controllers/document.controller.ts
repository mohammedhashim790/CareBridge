import type { Request, Response } from 'express';
import MedicalDocument from '../models/document.model.ts';

export const uploadDocument = async (req: Request, res: Response) => {
    try {
        const { patientId} = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const newDocument = new MedicalDocument({
            patientId,
            fileName: file.filename,
            filePath: file.path,
            fileType: file.mimetype, // multer adds mimetype
            fileSize: file.size,     // multer adds size in bytes
            uploadedBy: req.user?.id, // if using auth middleware attaching user to req
        });

        await newDocument.save();
        res.status(201).json({ message: 'Document uploaded successfully', document: newDocument });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Error uploading document', error: error instanceof Error ? error.message : error });
    }      
};

export const getDocuments = async (req: Request, res: Response) => {
    try {
        const { patientId } = req.query;

        if (!patientId) {
            return res.status(400).json({ message: 'patientId query param required' });
        }

        const documents = await MedicalDocument.find({ patientId })
            .sort({ uploadDate: 1 }) // oldest to newest for timeline
            .populate('patientId', 'name');

        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving documents', error });
    }
};

export const getPatientTimeline = async (req: Request, res: Response) => {
    try {
        const { patientId } = req.params;

        const documents = await MedicalDocument.find({ patientId })
            .sort({ uploadDate: 1 });

        // You could format response here if your frontend needs specific structure

        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patient timeline', error });
    }
};
