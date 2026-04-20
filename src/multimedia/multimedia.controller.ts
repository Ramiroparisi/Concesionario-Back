import { NextFunction, Request, Response } from 'express';
import { RequestContext } from '@mikro-orm/core';
import { Multimedia } from './multimedia.entity.js';

export const sanitizeMultimediaInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    archivo: req.body.archivo,
    orden: req.body.orden,
    vehiculo: req.body.vehiculo,

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
    const multimedias = await em.find(Multimedia, {}, { populate: ['vehiculo'] });
    res.status(200).json({ data: multimedias });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const findByVehiculo = async (req: Request, res: Response) => {
  try {
    const em = RequestContext.getEntityManager()!;
    const vehiculoId = Number.parseInt(req.params.vehiculoId as string);
    
    const multimedias = await em.find(
      Multimedia, 
      { vehiculo: vehiculoId }, 
      { orderBy: { orden: 'ASC' } }
    );
    res.status(200).json({ data: multimedias });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const add = async (req: Request, res: Response) => {
  try {
    const em = RequestContext.getEntityManager()!;
    const { archivo, orden, vehiculo } = req.body.sanitizedInput;

    if (!archivo || !vehiculo) {
      return res.status(400).json({ message: 'El archivo y el vehículo son obligatorios' });
    }

    const nuevaMultimedia = em.create(Multimedia, { archivo, orden, vehiculo });
    await em.persist(nuevaMultimedia).flush();
    
    res.status(201).json({ message: 'Multimedia creada', data: nuevaMultimedia });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const em = RequestContext.getEntityManager()!;
    const id = Number.parseInt(req.params.id as string);
    const multimedia = await em.findOne(Multimedia, id, { populate: ['vehiculo'] });
    
    if (!multimedia) {
      return res.status(404).json({ message: 'Multimedia no encontrada' });
    }
    await em.remove(multimedia).flush();
    res.status(200).json({ message: 'Multimedia eliminada' }); 
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};