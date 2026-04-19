import express from 'express';
import 'reflect-metadata';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import config from './shared/db/orm.js'; 

import { marcaRouter } from './marca/marca.routes.js';

const app = express();
app.use(express.json());

async function bootstrap() {
  try {
    const orm = await MikroORM.init(config);
    if (process.env.NODE_ENV !== 'production') {
      await orm.schema.update();
    }
    console.log('Se ha realizadola conexión a la bdd');

    app.use((req, res, next) => {
      RequestContext.create(orm.em, next);
    });

    // las rutas de negocio van acá
    app.use('/api/marcas', marcaRouter);

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