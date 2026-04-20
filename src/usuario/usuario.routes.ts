import { Router } from 'express';
import { findAll, add, update,remove, sanitizeUsuarioInput } from './usuario.controller.js';
import { validateUsuario } from './usuario.validator.js';

export const usuarioRouter = Router();

usuarioRouter.get('/', findAll);
usuarioRouter.post('/', validateUsuario, sanitizeUsuarioInput, add);
usuarioRouter.put('/:id', validateUsuario, sanitizeUsuarioInput, update);
usuarioRouter.delete('/:id', remove);