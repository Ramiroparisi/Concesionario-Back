import { Request, Response } from 'express';
import { RequestContext } from '@mikro-orm/core';
import jwt from 'jsonwebtoken';
import { Usuario } from '../usuario/usuario.entity.js';
import { comparePassword } from '../shared/utils/password.utils.js';

export const login = async (req: Request, res: Response) => {
  try {
    const em = RequestContext.getEntityManager()!;
    const { mail, contrasena } = req.body;

    const usuario = await em.findOne(Usuario, { mail });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const passwordValida = await comparePassword(contrasena, usuario.contrasena);
    if (!passwordValida) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol }, 
      process.env.JWT_SECRET as string
    );
    
    const diez_a = 10 * 365 * 24 * 60 * 60 * 1000; 
    res.cookie('token', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict', 
      maxAge: diez_a,
    });

    res.status(200).json({ 
      message: 'Login exitoso', 
      usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } 
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Sesión cerrada exitosamente' });
};