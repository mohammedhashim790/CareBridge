import express from 'express';
import {
  getAllMyHealthRecords,
  getMyHealthRecordsForToday,
  createMyHealthRecords,
  deleteMyHealthRecordForToday,
  getMyBloodCountHistory,
} from '../controllers/health-records.controller.ts';
import { authMiddleware } from '../middleware/auth.middleware.ts';

const router = express.Router();

router.get('/my/all', authMiddleware, getAllMyHealthRecords);
router.get('/my/today', authMiddleware, getMyHealthRecordsForToday);
router.get('/my/blood', authMiddleware, getMyBloodCountHistory);
router.post('/my', authMiddleware, createMyHealthRecords);
router.delete('/my/today', authMiddleware, deleteMyHealthRecordForToday); // Only for the development purpose

export default router;