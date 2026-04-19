import { Request, Response } from 'express';
import { RequestContext } from '@mikro-orm/core';
import { Marca } from './marca.entity.js';

export const findAll = async (req: Request, res: Response) => {
  try {
    const em = RequestContext.getEntityManager()!;
    const marcas = await em.find(Marca, {}, { populate: ['modelos'] });
    res.status(200).json({ data: marcas });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const add = async (req: Request, res: Response) => {
  try {
    const em = RequestContext.getEntityManager()!;
    const nuevaMarca = em.create(Marca, req.body);
    await em.persist(nuevaMarca).flush();
    res.status(201).json({ message: 'Marca creada', data: nuevaMarca });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};