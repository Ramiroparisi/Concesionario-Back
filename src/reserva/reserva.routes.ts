import { Router } from 'express';
import { findAll, addOnline, remove, sanitizeReservaInput, addPresencial } from './reserva.controller.js';
import { validateReserva } from './reserva.validator.js';

export const reservaRouter = Router();

reservaRouter.get('/', findAll);
reservaRouter.post('/online', validateReserva, sanitizeReservaInput, addOnline);
reservaRouter.post('/presencial', validateReserva, sanitizeReservaInput, addPresencial);
reservaRouter.delete('/:id', remove);