import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.ts';
import {
  createBioMarkers,
  getBioMarkerOfByPatientId,
} from '../controllers/bioMarkers.controller.ts';

const router = Router();

router.post('/', authMiddleware, createBioMarkers);
router.get('/', authMiddleware, getBioMarkerOfByPatientId);
router.get('/:patientId', authMiddleware, getBioMarkerOfByPatientId);


export default router;
