import { Router } from 'express';
import { findAll, addOnline, remove, sanitizeReservaInput, addPresencial, update } from './reserva.controller.js';
import { crearPreferencia, confirmarPago } from './reserva.controller.js';
import { validateReserva } from './reserva.validator.js';
import { checkAuth } from '../shared/middleware/auth.middleware.js';

export const reservaRouter = Router();

reservaRouter.get('/', checkAuth, findAll);
reservaRouter.post('/online', validateReserva, sanitizeReservaInput, addOnline);
reservaRouter.post('/presencial', validateReserva, sanitizeReservaInput, checkAuth, addPresencial);
reservaRouter.post('/preferencia', crearPreferencia);
reservaRouter.post('/confirmar', confirmarPago);

reservaRouter.patch('/:id', sanitizeReservaInput, checkAuth, update); 
reservaRouter.delete('/:id', checkAuth, remove);