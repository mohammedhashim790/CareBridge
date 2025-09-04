import { Router } from 'express';
import { createPrescription, getPrescriptionsByPatient, sharePrescription } from '../controllers/prescription.controller.ts';
import { authMiddleware } from '../middleware/auth.middleware.ts';

const router = Router();

router.post('/', authMiddleware, createPrescription);
router.get('/:patientId', authMiddleware, getPrescriptionsByPatient);
router.post('/:id/share', authMiddleware, sharePrescription);


export default router;