import { Router } from 'express';
import { findAll, add } from './marca.controler.js';

export const marcaRouter = Router();

marcaRouter.get('/', findAll);
marcaRouter.post('/', add);