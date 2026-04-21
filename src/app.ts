import express from 'express';
import 'reflect-metadata';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import config from './shared/db/orm.js'; 

import { appRouter } from './routes.js';

import { iniciarCronReservas } from './reserva/reserva.cron.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

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

  app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
  }));

    app.use('/api', appRouter);

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