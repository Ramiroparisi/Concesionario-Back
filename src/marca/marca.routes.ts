import { Router } from 'express';
import { findAll, getMarcaById, add, update, remove, sanitizeMarcaInput } from './marca.controller.js';
import { validateMarca } from './marca.validator.js';
import { checkAuth } from '../shared/middleware/auth.middleware.js';

export const marcaRouter = Router();

marcaRouter.get('/', findAll);
marcaRouter.get('/:id', getMarcaById);
marcaRouter.post('/', validateMarca, sanitizeMarcaInput, checkAuth, add);
marcaRouter.put('/:id', validateMarca, sanitizeMarcaInput, checkAuth, update);
marcaRouter.delete('/:id', checkAuth, remove);