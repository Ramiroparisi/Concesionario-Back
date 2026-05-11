import { Router } from 'express';
import { findAll, getUsuarioById, add, update,remove, sanitizeUsuarioInput,  } from './usuario.controller.js';
import { validateUsuario } from './usuario.validator.js';
import { checkAuth } from '../shared/middleware/auth.middleware.js';

export const usuarioRouter = Router();

usuarioRouter.get('/', checkAuth, findAll);
usuarioRouter.get('/:id', checkAuth, getUsuarioById);
usuarioRouter.post('/', validateUsuario, sanitizeUsuarioInput, checkAuth, add);
usuarioRouter.put('/:id', validateUsuario, sanitizeUsuarioInput, checkAuth, update);
usuarioRouter.delete('/:id', checkAuth, remove);