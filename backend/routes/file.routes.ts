import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.ts';
import {
  createFile,
  getFilesByPatient,
} from '../controllers/file.controller.ts';

const router = Router();

router.post('/', authMiddleware, createFile);
router.get('/:patientId', authMiddleware, getFilesByPatient);

export default router;
