import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: 'doctor' | 'patient';
      };
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res
        .status(401)
        .json({ message: 'No authentication token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    req.user = {
      id: decoded.id,
      role: decoded.role || decoded.userType, // Support both role and userType(legacy)
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid authentication token' });
  }
};
