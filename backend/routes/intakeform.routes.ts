import { Router } from 'express';
import {
  getIntakeFormById,
  getMyIntakeForm,
  createMyIntakeForm,
  updateMyIntakeForm,
  deleteMyIntakeForm,
} from '../controllers/intakeform.controller.ts'
import { authMiddleware } from '../middleware/auth.middleware.ts';

const router = Router();

router.get('/my', authMiddleware, getMyIntakeForm);
router.post('/my', authMiddleware, createMyIntakeForm);
router.put('/my', authMiddleware, updateMyIntakeForm);
router.delete('/my', authMiddleware, deleteMyIntakeForm);

router.get('/:id', authMiddleware, getIntakeFormById);

export default router;