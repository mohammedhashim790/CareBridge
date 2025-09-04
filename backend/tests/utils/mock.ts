import type { Request, Response } from 'express';
import { jest } from '@jest/globals';

export const mockRequest = (data: Partial<Request>) => data as unknown as Partial<Request>;

export function mockResponse(): Response {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };
  return res as unknown as Response;
}