import { NextFunction, Request, Response } from 'express';
import { RequestContext } from '@mikro-orm/core';
import { Usuario } from './usuario.entity.js';

export const sanitizeUsuarioInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    mail: req.body.mail,
    contrasena: req.body.contrasena,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    telefono: req.body.telefono,
    rol: req.body.rol,
  };
  
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
} 

export const findAll = async (req: Request, res: Response) => {
  try {
    const em = RequestContext.getEntityManager()!;
    const usuarios = await em.find(Usuario, {}, { populate: ['vehiculosVendidos'] });
    res.status(200).json({ data: usuarios });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ message: errorMessage });
  }
};

export const getUsuarioById = async (req: Request, res: Response) => {
  try {
    const em = RequestContext.getEntityManager()!;
    const id = Number.parseInt(req.params.id as string);
    const usuario = await em.findOne(Usuario, id); 
    
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    return res.status(200).json({ data: usuario });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return res.status(500).json({ message: errorMessage });
  }
};

export const add = async (req: Request, res: Response) => {
  try {
    const em = RequestContext.getEntityManager()!;
    const input = req.body.sanitizedInput;

    if (!input.mail || !input.contrasena || !input.nombre) {
      return res.status(400).json({ message: 'El mail, la contraseña y el nombre son obligatorios' });
    }

    const usuarioExistente = await em.findOne(Usuario, { mail: input.mail });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'Ya existe un usuario con este correo electrónico' });
    }

    const telefonoExistente = await em.findOne(Usuario, { telefono: input.telefono });
    if (telefonoExistente) {
      return res.status(400).json({ message: 'Ya existe un usuario con este número de teléfono' });
    }

    const nuevoUsuario = em.create(Usuario, input);
    await em.persist(nuevoUsuario).flush();
    
    res.status(201).json({ message: 'Usuario creado', data: nuevoUsuario });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ message: errorMessage });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const em = RequestContext.getEntityManager()!;
    const id = Number.parseInt(req.params.id as string);
    const input = req.body.sanitizedInput;
    const usuarioToUpdate = await em.findOne(Usuario, id);
    if (!usuarioToUpdate) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }    
    em.assign(usuarioToUpdate, input);
    await em.flush();
    res.status(200).json({ 
      message: 'Usuario actualizado exitosamente', 
      data: usuarioToUpdate 
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ message: errorMessage });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const em = RequestContext.getEntityManager()!;
    const id = Number.parseInt(req.params.id as string);
    const usuario = await em.findOne(Usuario, id, { populate: ['vehiculosVendidos'] });
    
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    const autosVendidos = usuario.vehiculosVendidos.getItems();
    for (const auto of autosVendidos) {
      auto.vendedor = undefined; 
    }

    await em.remove(usuario).flush();
    res.status(200).json({ message: 'Usuario eliminado con éxito' }); 
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ message: errorMessage });
  }
};