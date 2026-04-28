import { Router } from 'express';
import { findAll, getModeloById, add, update, remove, sanitizeModeloInput } from './modelo.controller.js';
import { validateModelo } from './modelo.validator.js';

export const modeloRouter = Router();

modeloRouter.get('/', findAll);
modeloRouter.get('/:id', getModeloById);
modeloRouter.post('/', validateModelo, sanitizeModeloInput, add);
modeloRouter.put('/:id', validateModelo, sanitizeModeloInput, update);
modeloRouter.delete('/:id', remove);