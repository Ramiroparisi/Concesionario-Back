import express from 'express';
import 'reflect-metadata';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import config from './shared/db/orm.js'; 

import { marcaRouter } from './marca/marca.routes.js';
import { modeloRouter } from './modelo/modelo.routes.js';
import { vehiculoRouter } from './vehiculo/vehiculo.routes.js';
import { multimediaRouter } from './multimedia/multimedia.routes.js';
import { usuarioRouter } from './usuario/usuario.routes.js';
import { reservaRouter } from './reserva/reserva.routes.js';

import { iniciarCronReservas } from './reserva/reserva.cron.js';

const app = express();
app.use(express.json());

async function bootstrap() {
  try {
    const orm = await MikroORM.init(config);
    if (process.env.NODE_ENV !== 'production') {
      await orm.schema.update();
    }
    console.log('Se ha realizado la conexión a la bdd');

    app.use((req, res, next) => {
      RequestContext.create(orm.em, next);
    });
    iniciarCronReservas(orm);
    
    // las rutas de negocio van acá
    app.use('/api/marcas', marcaRouter);
    app.use('/api/modelos', modeloRouter);
    app.use('/api/vehiculos', vehiculoRouter);
    app.use('/api/multimedias', multimediaRouter);
    app.use('/api/usuarios', usuarioRouter);
    app.use('/api/reservas', reservaRouter);

    app.use((_, res) => {
      res.status(404).json({ message: 'Recurso no encontrado' });
    });

    app.listen(3000, () => {
      console.log('Server running on http://localhost:3000/');
    });

  } catch (error) {
    console.error('Error al iniciar la app:', error);
    process.exit(1);
  }
}

bootstrap();