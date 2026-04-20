import { NextFunction, Request, Response } from 'express';
import { RequestContext } from '@mikro-orm/core';
import { Vehiculo } from './vehiculo.entity.js';
import { Modelo } from '../modelo/modelo.entity.js';


export const sanitizeVehiculoInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    kilometraje: req.body.kilometraje,
    anio: req.body.anio,
    patente: req.body.patente,
    color: req.body.color,
    descripcion: req.body.descripcion,
    precio: req.body.precio,
    estado: req.body.estado,
    vendedor: req.body.vendedor,
    modelo: req.body.modelo,
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
    const vehiculos = await em.find(Vehiculo, {}, { populate: ['modelo'] });
    res.status(200).json({ data: vehiculos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const add = async (req: Request, res: Response) => {
  try {
    const em = RequestContext.getEntityManager()!;
    const input = req.body.sanitizedInput;

    if (input.estado === 'Vendido' && !input.vendedor) {
      return res.status(400).json({ message: 'Un vehículo con estado Vendido debe tener un vendedor asignado.' });
    }
    
    if (input.estado !== 'Vendido' && input.vendedor) {
      input.vendedor = null; 
    }

    const existingVehiculo = await em.findOne(Vehiculo, { patente: input.patente });
    if (existingVehiculo) {
      return res.status(400).json({ message: 'Ya existe un vehículo con esa patente' });
    }

    const modelo = await em.findOne(Modelo, input.modelo);
    if (!modelo) {
      return res.status(400).json({ message: 'Modelo no encontrado' });
    }

    const nuevoVehiculo = em.create(Vehiculo, input); 
    await em.persist(nuevoVehiculo).flush();
    res.status(201).json({ message: 'Vehículo creado', data: nuevoVehiculo });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const em = RequestContext.getEntityManager()!;
    const id = Number.parseInt(req.params.id as string);
    const VehiculoToUpdate = await em.findOne(Vehiculo, { id });
    
    if (!VehiculoToUpdate) {
      return res.status(404).json({ message: 'Vehículo no encontrado' });
    }
    em.assign(VehiculoToUpdate, req.body.sanitizedInput ?? req.body);
    await em.flush();
    res.status(200).json({
      message: 'Vehículo modificado exitosamente',
      data: VehiculoToUpdate,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const remove = async (req: Request, res: Response) => {
  try {
    const em = RequestContext.getEntityManager()!;
    const id = Number.parseInt(req.params.id as string);
    const vehiculo = await em.findOne(Vehiculo, id, { populate: ['modelo'] });
    
    if (!vehiculo) {
      return res.status(404).json({ message: 'Vehículo no encontrado' });
    }

    await em.remove(vehiculo).flush();
    res.status(200).json({ message: 'Vehículo eliminado' }); 
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};