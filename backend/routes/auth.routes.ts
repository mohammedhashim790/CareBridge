import express from 'express';
import { check } from 'express-validator';
import {
  forgotPassword,
  getProfile,
  login,
  logout,
  registerDoctor,
  registerPatient,
  resetPassword,
  verifyOtp,
} from '../controllers/auth.controller.ts';
import { authMiddleware } from '../middleware/auth.middleware.ts';

const router = express.Router();

router.post(
  '/register/doctor',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 8 characters').isLength({
      min: 8,
    }),
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('phone', 'Phone number is required').not().isEmpty(),
    check('licenseNumber', 'License number is required').not().isEmpty(),
    check('specialization', 'Specialization is required').not().isEmpty(),
  ],
  registerDoctor
);

router.post(
  '/register/patient',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 8 characters').isLength({
      min: 8,
    }),
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('phone', 'Phone number is required').not().isEmpty(), // check('address.street', 'Street is required').not().isEmpty(),
    // check('address.city', 'City is required').not().isEmpty(),
    // check('address.state', 'State is required').not().isEmpty(),
    // check('address.postalCode', 'Postal code is required').not().isEmpty(),
    // check('address.country', 'Country is required').not().isEmpty(),
    check('dateOfBirth', 'Date of birth is required').not().isEmpty(),
    check('gender', 'Gender is required').isIn(['male', 'female', 'other']),
    authMiddleware,
  ],
  registerPatient
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
  ],
  login
);

router.get('/profile', authMiddleware, getProfile);

router.post('/logout', authMiddleware, logout);

router.post(
  '/forgot-password',
  [check('email', 'Please include a valid email').isEmail()],
  forgotPassword
);

router.post('/verify-otp', verifyOtp);

router.post(
  '/reset-password',
  [
    check('password', 'Password must be at least 8 characters').isLength({
      min: 8,
    }),
  ],
  resetPassword
); // POST to submit a new password

export default router;
