import { NextFunction, Request, Response } from 'express';
import { RequestContext } from '@mikro-orm/core';
import { Reserva, EstadoReserva, FormaPago, EstadoPago } from './reserva.entity.js';
import { Vehiculo, EstadoVehiculo } from '../vehiculo/vehiculo.entity.js';
import { enviarEmailsReserva } from '../shared/utils/email.service.js';
import { Preference } from 'mercadopago/dist/clients/preference/index.js';
import { MercadoPagoConfig } from 'mercadopago/dist/mercadoPagoConfig.js';

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
    const reservas = await em.find(Reserva, {}, { 
      populate: ['vehiculo', 'vehiculo.modelo', 'vehiculo.modelo.marca'] 
    });
    res.status(200).json({ data: reservas });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ message: errorMessage });
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ message: errorMessage });
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
    input.estadoReserva = EstadoReserva.ACTIVA;
    input.estadoPago = EstadoPago.APROBADO;
    const fechaActual = new Date();
    const fechaVencimiento = new Date(fechaActual.setDate(fechaActual.getDate() + 21));
    input.fechaVenc = fechaVencimiento;

    const nuevaReserva = em.create(Reserva, input);
    autoAReservar.estado = EstadoVehiculo.RESERVADO;

    await em.persist([nuevaReserva, autoAReservar]).flush();
    res.status(201).json({ message: 'Seña en efectivo registrada con éxito', data: nuevaReserva });
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
    
    const reservaToUpdate = await em.findOne(Reserva, id, { populate: ['vehiculo'] });
    
    if (!reservaToUpdate) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    const nuevoEstado = req.body.estadoReserva || req.body.estado;

    if (nuevoEstado) {
      reservaToUpdate.estadoReserva = nuevoEstado;

      if (nuevoEstado === EstadoReserva.CANCELADA || nuevoEstado === EstadoReserva.VENCIDA) {
        reservaToUpdate.vehiculo.estado = EstadoVehiculo.DISPONIBLE; 
      } 
      else if (nuevoEstado === EstadoReserva.FINALIZADA) {
        reservaToUpdate.vehiculo.estado = EstadoVehiculo.VENDIDO;
      }
    }
    // ------------------------------------

    em.assign(reservaToUpdate, input);
    
    await em.flush();
    
    res.status(200).json({ message: 'Reserva actualizada', data: reservaToUpdate });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ message: errorMessage });
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

    if (reserva.estadoReserva === EstadoReserva.ACTIVA) {
      reserva.vehiculo.estado = EstadoVehiculo.DISPONIBLE;
    }

    await em.remove(reserva).flush();
    res.status(200).json({ message: 'Reserva eliminada' }); 
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ message: errorMessage });
  }
};


const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN as string});

export const crearPreferencia = async (req: Request, res: Response) => {
  try {
    const em = req.app.locals.em.fork();
    const { vehiculo_id, vehiculoId, nombreCli, nombre, apellidoCli, apellido, dni, mail, telefono, importe } = req.body;

    const idFinal = vehiculo_id || vehiculoId;
    const nombreFinal = nombreCli || nombre;
    const apellidoFinal = apellidoCli || apellido;    
    
    if (!idFinal) {
       return res.status(400).json({ message: 'El ID del vehículo es obligatorio' });
    }

    if (!nombreFinal || !apellidoFinal) {
      return res.status(400).json({ message: 'El nombre y apellido son obligatorios' });
    }

    const vehiculo = await em.findOne(Vehiculo, idFinal, { populate: ['modelo', 'modelo.marca'] });
    if (!vehiculo) {
        return res.status(404).json({ message: 'Vehículo no encontrado' });
    }

const preferenciaData = {
      body: {
        items: [{
          id: vehiculo.id.toString(),
          title: `Reserva ${vehiculo.modelo.marca.nombre} ${vehiculo.modelo.nombre}`,
          quantity: 1,
          unit_price: Number(importe),
          currency_id: 'ARS'
        }],
        payer: {
          email: mail,
          name: nombreCli,
          surname: apellidoCli
        },
        back_urls: {
          success: `${process.env.FRONTEND_URL}/Vehiculos/${vehiculoId}`,
          failure: `${process.env.FRONTEND_URL}/Vehiculos/${vehiculoId}`,
          pending: `${process.env.FRONTEND_URL}/Vehiculos/${vehiculoId}`
        },
        auto_return: 'approved' 
      }
    };
    console.log("Objeto a enviar a Mercado Pago:", JSON.stringify(preferenciaData, null, 2));

    const preference = new Preference(client);
    const response = await preference.create(preferenciaData);

    const fechaVenc = new Date();
    fechaVenc.setDate(fechaVenc.getDate() + 21); 

    const nuevaReserva = em.create(Reserva, {
      nombreCli: nombreFinal,
      apellidoCli: apellidoFinal,
      dni,
      mail,
      telefono,
      importe: Number(importe),
      fechaVenc,
      mp_preference_id: response.id,
      estadoReserva: EstadoReserva.PENDIENTE_PAGO,
      estadoPago: EstadoPago.PENDIENTE,
      vehiculo
    });

    em.persist(nuevaReserva);
    await em.flush();
    
    res.status(200).json({ preferenceId: response.id });
    
  } catch (error) {
    console.error("Error en el back:", error);
    res.status(500).json({ message: 'Error al procesar reserva' });
  }
};

export const confirmarPago = async (req: Request, res: Response) => {
  try {
    const em = req.app.locals.em.fork();
    const { preference_id, payment_id } = req.body;

    const reserva = await em.findOne(Reserva, { mp_preference_id: preference_id }, { populate: ['vehiculo', 'vehiculo.modelo', 'vehiculo.modelo.marca'] });
    
    if (reserva && reserva.estadoPago !== EstadoPago.APROBADO) {
      reserva.estadoPago = EstadoPago.APROBADO;
      reserva.estadoReserva = EstadoReserva.ACTIVA;
      reserva.mp_payment_id = payment_id;
      reserva.vehiculo.estado = EstadoVehiculo.RESERVADO;

      await em.flush();
      const nombreAuto = `${reserva.vehiculo.modelo.marca.nombre} ${reserva.vehiculo.modelo.nombre}`;
      await enviarEmailsReserva(reserva, nombreAuto);
    }
    
    res.status(200).json({ message: 'OK' });
  } catch (error) {
    res.status(500).json({ message: 'Error al confirmar' });
  }
};