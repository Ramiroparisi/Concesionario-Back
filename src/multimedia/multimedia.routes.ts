import { Router } from 'express';
import { add, findAll, findByVehiculo, remove, sanitizeMultimediaInput } from './multimedia.controller.js';
import { validateMultimedia } from './multimedia.validator.js';
import { checkAuth } from '../shared/middleware/auth.middleware.js';

export const multimediaRouter = Router();

multimediaRouter.get('/', findAll);
multimediaRouter.post('/', validateMultimedia, checkAuth, sanitizeMultimediaInput, add);
multimediaRouter.delete('/:id', checkAuth, remove);
multimediaRouter.get('/vehiculo/:vehiculoId', findByVehiculo);