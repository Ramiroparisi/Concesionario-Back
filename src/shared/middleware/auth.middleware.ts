import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  usuario?: { id: number; rol: string };
}

export const verificarToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere iniciar sesión.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.usuario = decoded as { id: number; rol: string };
    
    next(); 
  } catch (error) {
    return res.status(401).json({ message: 'La sesión expiró o el token es inválido' });
  }
};