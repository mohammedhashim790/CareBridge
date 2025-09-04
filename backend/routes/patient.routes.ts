import express from 'express';
import {
  getMyPatientProfile,
  getPatientById,
  updatePatientProfile,
  getAllPatients, getPatientByPatientId,
} from '../controllers/patient.controller.ts';
import { authMiddleware } from '../middleware/auth.middleware.ts';

const router = express.Router();

router.get('/myprofile', authMiddleware, getMyPatientProfile);
router.get('/:id', authMiddleware, getPatientById);
router.get('/detail/:patientId', authMiddleware, getPatientByPatientId);
router.put('/:id', authMiddleware, updatePatientProfile);
router.get('/', authMiddleware, getAllPatients);

export default router;
