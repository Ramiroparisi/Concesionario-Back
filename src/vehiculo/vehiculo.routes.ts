import { Router } from 'express';
import { sanitizeVehiculoInput, findAll, add, update, remove } from './vehiculo.controller.js';
import { validateVehiculo } from './vehiculo.validator.js';

export const vehiculoRouter = Router();

vehiculoRouter.get('/', findAll);
vehiculoRouter.post('/', validateVehiculo, sanitizeVehiculoInput, add);
vehiculoRouter.put('/:id', validateVehiculo, sanitizeVehiculoInput, update);
vehiculoRouter.delete('/:id', remove);