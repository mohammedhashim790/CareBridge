import express from 'express';
import { uploadDocument, getDocuments, getPatientTimeline } from '../controllers/document.controller.ts';
import uploadMiddleware from '../middleware/document.middleware.ts';
import { authMiddleware } from '../middleware/auth.middleware.ts';

const router = express.Router();

// @ts-ignore
router.post('/upload', authMiddleware, uploadMiddleware, uploadDocument);
router.get('/timeline/:patientId', getPatientTimeline);

export default router;