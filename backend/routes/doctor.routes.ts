import express from 'express';
import {
  getMyDoctorProfile,
  getDoctorById,
  updateDoctorProfile,
  getMyPatients, getMyPatientsList,
} from '../controllers/doctor.controller.ts';
import { authMiddleware } from '../middleware/auth.middleware.ts';

const router = express.Router();

router.get('/myprofile', authMiddleware, getMyDoctorProfile);
router.get('/mypatients', authMiddleware, getMyPatients);
router.get('/myPatientsList', authMiddleware, getMyPatientsList);
router.get('/:id', authMiddleware, getDoctorById);
router.put('/:id', authMiddleware, updateDoctorProfile);

export default router;
