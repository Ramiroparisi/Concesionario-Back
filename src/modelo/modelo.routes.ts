import { Router } from 'express';
import { findAll, getModeloById, add, update, remove, sanitizeModeloInput } from './modelo.controller.js';
import { validateModelo } from './modelo.validator.js';
import { checkAuth } from '../shared/middleware/auth.middleware.js';

export const modeloRouter = Router();

modeloRouter.get('/', findAll);
modeloRouter.get('/:id', getModeloById);
modeloRouter.post('/', validateModelo, sanitizeModeloInput, checkAuth, add);
modeloRouter.put('/:id', validateModelo, sanitizeModeloInput, checkAuth, update);
modeloRouter.delete('/:id', checkAuth, remove);