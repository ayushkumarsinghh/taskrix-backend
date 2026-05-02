import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

export const roleMiddleware = (role: 'ADMIN' | 'USER') => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ message: `${role} access required` });
    }
    next();
  };
};
