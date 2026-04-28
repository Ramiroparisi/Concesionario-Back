import { NextFunction, Request, Response } from 'express';
import { RequestContext } from '@mikro-orm/core';
import { Modelo } from './modelo.entity.js';

export const sanitizeModeloInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    cantPuertas: req.body.cantPuertas,
    combustible: req.body.combustible,
    motor: req.body.motor,
    potencia: req.body.potencia,
    transmision: req.body.transmision,
    marca: req.body.marca,
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
    const modelos = await em.find(Modelo, {}, { populate: ['marca', 'vehiculos'] });
    res.status(200).json({ data: modelos });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ message: errorMessage });
  }
};

export const getModeloById = async (req: Request, res: Response) => {
  try {
    const em = RequestContext.getEntityManager()!;
    const id = Number.parseInt(req.params.id as string);
    const modelo = await em.findOne(Modelo, id, { populate: ['marca'] }); 
    
    if (!modelo) {
      return res.status(404).json({ message: 'Modelo no encontrado' });
    }
    
    return res.status(200).json({ data: modelo });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return res.status(500).json({ message: errorMessage });
  }
};

export const add = async (req: Request, res: Response) => {
  try {
    const em = RequestContext.getEntityManager()!;
    const inputNombre = req.body.sanitizedInput.nombre;
    const modeloExistente = await em.findOne(Modelo, { nombre: inputNombre });        
      if (modeloExistente) {
        return res.status(400).json({ message: `El modelo '${inputNombre}' ya existe en el sistema.` });
      }
    const nuevoModelo = em.create(Modelo, req.body.sanitizedInput);
    await em.persist(nuevoModelo).flush();
    res.status(201).json({ message: 'Modelo creado', data: nuevoModelo });
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
    const modeloToUpdate = await em.findOne(Modelo, id);
    if (!modeloToUpdate) {
      return res.status(404).json({ message: 'Modelo no encontrado' });
    }
    em.assign(modeloToUpdate, input);
    await em.flush();
    res.status(200).json({ 
      message: 'Modelo actualizado exitosamente', 
      data: modeloToUpdate 
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
    const modelo = await em.findOne(Modelo, id, { populate: ['vehiculos'] });
    
    if (!modelo) {
      return res.status(404).json({ message: 'Modelo no encontrado' });
    }
    
    const vehiculosAsociados = modelo.vehiculos.getItems();
    if (vehiculosAsociados.length > 0) {
      return res.status(400).json({ message: 'No se puede eliminar el modelo porque tiene vehículos asociados' });
    }

    await em.remove(modelo).flush();
    res.status(200).json({ message: 'Modelo eliminado' }); 
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ message: errorMessage });
  }
};