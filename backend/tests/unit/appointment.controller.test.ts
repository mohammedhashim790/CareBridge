import { jest, describe, beforeEach, afterEach, it, expect } from '@jest/globals';
import type { Request, Response } from 'express';
import {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '../../controllers/appointment.controller.js';
import { Appointment } from '../../models/appointment.model.js';
import { mockRequest, mockResponse } from '../utils/mock.js';

jest.mock('../../models/appointment.model'); // Mock the model
jest.mock('../../utils/validateExistence', () => ({
  isDoctorExists: jest.fn((): Promise<boolean> => Promise.resolve(true)),
  isPatientExists: jest.fn((): Promise<boolean> => Promise.resolve(true)),
})); // Mock validation functions

const MockAppointment = Appointment as jest.Mocked<typeof Appointment>; // Get the mocked model typed

describe('Appointment Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const testAppointment = {
    _id: '1',
    doctorId: 'd1',
    patientId: 'p1',
    appointmentDate: new Date(),
  }

  describe('getAllAppointments', () => {
    it('should return all appointments with status 200', async () => {
      // Arrange
      const mockAppointments = [testAppointment];

      // Mocks
      const req = {} as Request;
      const res = mockResponse();

      (MockAppointment.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue(mockAppointments),
      } as any);

      // Act
      await getAllAppointments(req, res);

      // Assert
      expect(Appointment.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockAppointments);
    });
  });

  describe('getAppointmentById', () => {
    it('should return one appointment', async () => {
      const req = mockRequest({ params: { id: testAppointment._id } }) as Request;
      const res = mockResponse();

      (MockAppointment.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValueOnce(testAppointment),
      });

      await getAppointmentById(req, res);

      expect(Appointment.findById).toHaveBeenCalledWith(testAppointment._id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(testAppointment);
    });
  });

  describe('createAppointment', () => {
    it('should create an appointment', async () => {
      const req = mockRequest({
        body: {
          patientId: testAppointment.patientId,
          doctorId: testAppointment.doctorId,
          appointmentDate: testAppointment.appointmentDate,
        },
      }) as Request;
      const res = mockResponse();

      // Mock Appointment constructor to return an object with save()
      (Appointment as unknown as jest.Mock).mockImplementation(() => ({
        save: jest.fn().mockReturnValue(testAppointment),
      }));

      await createAppointment(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return 400 for missing fields', async () => {
      const req = mockRequest({ body: {} }) as Request;
      const res = mockResponse();

      await createAppointment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('updateAppointment', () => {
    it('should update an appointment', async () => {
      const updated = { 
        _id: testAppointment._id, 
        patientId: testAppointment.patientId,
        dortorId: testAppointment.doctorId,
        appointmentDate: '2025-07-10',
      };

      const req = mockRequest({
        params: { id: testAppointment._id },
        body: { appointmentDate: '2025-07-10' },
      }) as Request;
      const res = mockResponse();

      (Appointment.findByIdAndUpdate as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue(updated),
      });

      await updateAppointment(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updated);
    });
  });

  describe('deleteAppointment', () => {
    it('should delete an appointment', async () => {
      const req = mockRequest( { params: { _id: testAppointment._id } }) as Request;
      const res = mockResponse();

      // Return a fake deleted appointment
      MockAppointment.findByIdAndDelete.mockResolvedValue(testAppointment);

      await deleteAppointment(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Appointment deleted successfully' });
    });

    it('should return 404 if not found', async () => {
      const req = mockRequest( { params: { _id: '123' } }) as Request;
      const res = mockResponse();

      // Return null to simulate not found
      MockAppointment.findByIdAndDelete.mockResolvedValue(null);

      await deleteAppointment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
