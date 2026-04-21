import { Router } from 'express';

import { authRouter } from './auth/auth.routes.js';
import { vehiculoRouter } from './vehiculo/vehiculo.routes.js';
import { usuarioRouter } from './usuario/usuario.routes.js';
import { reservaRouter } from './reserva/reserva.routes.js';
import { modeloRouter } from './modelo/modelo.routes.js';
import { marcaRouter } from './marca/marca.routes.js';
import { multimediaRouter } from './multimedia/multimedia.routes.js';

export const appRouter = Router();

appRouter.use('/auth', authRouter);

appRouter.use('/vehiculos', vehiculoRouter);
appRouter.use('/usuarios', usuarioRouter);
appRouter.use('/reservas', reservaRouter);
appRouter.use('/modelos', modeloRouter);
appRouter.use('/marcas', marcaRouter);
appRouter.use('/multimedia', multimediaRouter);
