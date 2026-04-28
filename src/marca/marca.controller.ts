import { NextFunction, Request, Response } from 'express';
import { RequestContext } from '@mikro-orm/core';
import { Marca } from './marca.entity.js';

export const sanitizeMarcaInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
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
    const marcas = await em.find(Marca, {}, { populate: ['modelos'] });
    res.status(200).json({ data: marcas });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ message: errorMessage });
  }
};

export const getMarcaById = async (req: Request, res: Response) => {
  try {
    const em = RequestContext.getEntityManager()!;
    const id = Number.parseInt(req.params.id as string);
    const marca = await em.findOne(Marca, id, { populate: ['modelos'] }); 
    
    if (!marca) {
      return res.status(404).json({ message: 'Marca no encontrada' });
    }
    
    return res.status(200).json({ data: marca });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return res.status(500).json({ message: errorMessage });
  }
};

export const add = async (req: Request, res: Response) => {
  try {
    const em = RequestContext.getEntityManager()!;
    const inputNombre = req.body.sanitizedInput.nombre;
    const marcaExistente = await em.findOne(Marca, { nombre: inputNombre });
    
    if (marcaExistente) {
      return res.status(400).json({ message: `La marca '${inputNombre}' ya existe en el sistema.` });
    }
    
    const nuevaMarca = em.create(Marca, req.body.sanitizedInput);
    await em.persist(nuevaMarca).flush();
    res.status(201).json({ message: 'Marca creada', data: nuevaMarca });
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
    const marcaToUpdate = await em.findOne(Marca, id);
    if (!marcaToUpdate) {
      return res.status(404).json({ message: 'Marca no encontrada' });
    }
    em.assign(marcaToUpdate, input);
    await em.flush();
    res.status(200).json({ 
      message: 'Marca actualizada exitosamente', 
      data: marcaToUpdate 
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
    const marca = await em.findOne(Marca, id, { populate: ['modelos'] });
    
    if (!marca) {
      return res.status(404).json({ message: 'Marca no encontrada' });
    }
    
    const modelosAsociados = marca.modelos.getItems();
    if (modelosAsociados.length > 0) {
      return res.status(400).json({ message: 'No se puede eliminar la marca porque tiene modelos asociados' });
    }

    await em.remove(marca).flush();
    res.status(200).json({ message: 'Marca eliminada' }); 
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ message: errorMessage });
  }
};