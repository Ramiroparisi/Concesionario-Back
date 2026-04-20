import { Router } from 'express';
import { add, findAll, findByVehiculo, remove, sanitizeMultimediaInput } from './multimedia.controller.js';
import { validateMultimedia } from './multimedia.validator.js';

export const multimediaRouter = Router();

multimediaRouter.get('/', findAll);
multimediaRouter.post('/', validateMultimedia, sanitizeMultimediaInput, add);
multimediaRouter.delete('/:id', remove);
multimediaRouter.get('/vehiculo/:vehiculoId', findByVehiculo);