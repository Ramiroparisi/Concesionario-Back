import { Router } from 'express';
import { findAll, add, update,remove, sanitizeMarcaInput } from './marca.controller.js';
import { validateMarca } from './marca.validator.js';

export const marcaRouter = Router();

marcaRouter.get('/', findAll);
marcaRouter.post('/', validateMarca, sanitizeMarcaInput, add);
marcaRouter.put('/:id', validateMarca, sanitizeMarcaInput, update);
marcaRouter.delete('/:id', remove);