import { defineConfig } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Marca } from '../../marca/marca.entity.js';
import { Modelo } from '../../modelo/modelo.entity.js';
import { Multimedia } from '../../multimedia/multimedia.entity.js';
import { Reserva } from '../../reserva/reserva.entity.js';
import { Usuario } from '../../usuario/usuario.entity.js';
import { Vehiculo } from '../../vehiculo/vehiculo.entity.js';
import {config} from 'dotenv';

config();

export default defineConfig({
  entities: [Marca, Modelo, Multimedia, Reserva, Usuario,Vehiculo,],
  clientUrl: process.env.BDD_URL, 
  metadataProvider: TsMorphMetadataProvider,
  highlighter: new SqlHighlighter(),
  debug: process.env.NODE_ENV !== 'production',
  schemaGenerator: {
    disableForeignKeys: false, 
    createForeignKeyConstraints: true,
  },
});