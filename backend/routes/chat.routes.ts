import express from 'express';
import {
  createChat,
  getChatContext,
  getDoctorChatList,
  getPatientChatList,
  replyChat,
} from '../controllers/chat.controller.ts';
import { authMiddleware } from '../middleware/auth.middleware.ts';

const router = express.Router();

router.post('/create', createChat);
router.post('/reply', replyChat);

router.get('/get/:doctorId', authMiddleware, getChatContext);
router.get('/list', authMiddleware, getPatientChatList);
router.get('/list/doctor', authMiddleware, getDoctorChatList);

export default router;
