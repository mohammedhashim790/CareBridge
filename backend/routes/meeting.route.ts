import express from 'express';
import { scheduleMeeting, getMeetingByTime } from '../controllers/meeting.controller.ts';

const router = express.Router();

router.post("/schedule", scheduleMeeting);
router.get("/get/:time", getMeetingByTime);

export default router;
