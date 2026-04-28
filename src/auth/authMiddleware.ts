import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: number;
  rol: string;
}

export interface CustomRequest extends Request {
  user?: UserPayload;
}

export const checkAuth = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No hay token, autorización denegada" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
    req.user = decoded;
    
    next();
  } catch (error: any) {
    console.error('Error al verificar JWT:', error.message);
    return res.status(401).json({ message: "Token no válido" });
  }
};