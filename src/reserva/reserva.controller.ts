import { NextFunction, Request, Response } from 'express';
import { RequestContext } from '@mikro-orm/core';
import { Reserva, EstadoReserva, FormaPago } from './reserva.entity.js';
import { Vehiculo, EstadoVehiculo } from '../vehiculo/vehiculo.entity.js';

export const sanitizeReservaInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    nombreCli: req.body.nombreCli,
    apellidoCli: req.body.apellidoCli,
    dni: req.body.dni,
    mail: req.body.mail,
    telefono: req.body.telefono,
    importe: req.body.importe,
    estado: req.body.estado,
    fechaVenc: req.body.fechaVenc,
    mp_payment_id: req.body.mp_payment_id,
    mp_preference_id: req.body.mp_preference_id,
    formaPago: req.body.formaPago,
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
    const reservas = await em.find(Reserva, {}, { populate: ['vehiculo'] });
    res.status(200).json({ data: reservas });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addOnline = async (req: Request, res: Response) => {
  try {
    const em = RequestContext.getEntityManager()!;
    const input = req.body.sanitizedInput;

    if (!input.vehiculo || !input.nombreCli || !input.mail || !input.importe) {
      return res.status(400).json({ message: 'Faltan datos obligatorios para registrar la reserva' });
    }

    const autoAReservar = await em.findOne(Vehiculo, input.vehiculo);
    
    if (!autoAReservar) {
      return res.status(404).json({ message: 'Vehículo no encontrado' });
    }

    if (autoAReservar.estado !== EstadoVehiculo.DISPONIBLE) {
      return res.status(400).json({ message: 'Este vehículo ya no se encuentra disponible.' });
    }

    const fechaActual = new Date();
    const fechaVencimiento = new Date(fechaActual.setDate(fechaActual.getDate() + 21));
    input.fechaVenc = fechaVencimiento;

    const nuevaReserva = em.create(Reserva, input);
    autoAReservar.estado = EstadoVehiculo.RESERVADO;
    await em.persist([nuevaReserva, autoAReservar]).flush();
    
    res.status(201).json({ message: 'Reserva generada con éxito', data: nuevaReserva });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addPresencial = async (req: Request, res: Response) => {
  try {
    const em = RequestContext.getEntityManager()!;
    const input = req.body.sanitizedInput;
    const autoAReservar = await em.findOne(Vehiculo, input.vehiculo);
    
    if (!autoAReservar) {
      return res.status(404).json({ message: 'Vehículo no encontrado' });
    }

    if (autoAReservar.estado !== EstadoVehiculo.DISPONIBLE) {
      return res.status(400).json({ message: 'Este vehículo ya no se encuentra disponible.' });
    }

    input.formaPago = FormaPago.EFECTIVO;
    input.mp_payment_id = null;
    input.mp_preference_id = null;
    const fechaActual = new Date();
    const fechaVencimiento = new Date(fechaActual.setDate(fechaActual.getDate() + 21));
    input.fechaVenc = fechaVencimiento;

    const nuevaReserva = em.create(Reserva, input);
    autoAReservar.estado = EstadoVehiculo.RESERVADO;

    await em.persist([nuevaReserva, autoAReservar]).flush();
    res.status(201).json({ message: 'Seña en efectivo registrada con éxito', data: nuevaReserva });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const em = RequestContext.getEntityManager()!;
    const id = Number.parseInt(req.params.id as string);
    const input = req.body.sanitizedInput; 
    
    const reservaToUpdate = await em.findOne(Reserva, id, { populate: ['vehiculo'] });
    
    if (!reservaToUpdate) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    if (input.estado === EstadoReserva.VENCIDA && reservaToUpdate.estado !== EstadoReserva.VENCIDA) {
      reservaToUpdate.vehiculo.estado = EstadoVehiculo.DISPONIBLE;
    }

    em.assign(reservaToUpdate, input);
    await em.flush();
    res.status(200).json({ message: 'Reserva actualizada', data: reservaToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const em = RequestContext.getEntityManager()!;
    const id = Number.parseInt(req.params.id as string);
    const reserva = await em.findOne(Reserva, id, { populate: ['vehiculo'] });
    
    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    if (reserva.estado === EstadoReserva.ACTIVA) {
      reserva.vehiculo.estado = EstadoVehiculo.DISPONIBLE;
    }

    await em.remove(reserva).flush();
    res.status(200).json({ message: 'Reserva eliminada' }); 
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
