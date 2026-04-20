import cron from 'node-cron';
import { MikroORM } from '@mikro-orm/core';
import { Reserva, EstadoReserva } from './reserva.entity.js';
import { EstadoVehiculo } from '../vehiculo/vehiculo.entity.js';

export const iniciarCronReservas = (orm: MikroORM) => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Revisando reservas vencidas...');
    
    try {
      const em = orm.em.fork();
      const ahora = new Date();
      const reservasVencidas = await em.find(Reserva, {
        estado: EstadoReserva.ACTIVA,
        fechaVenc: { $lt: ahora }
      }, { populate: ['vehiculo'] });

      if (reservasVencidas.length > 0) {
        for (const reserva of reservasVencidas) {
          reserva.estado = EstadoReserva.VENCIDA;
          reserva.vehiculo.estado = EstadoVehiculo.DISPONIBLE;
        }
        await em.flush();
        console.log(`Se vencieron automáticamente ${reservasVencidas.length} reservas.`);
      } else {
        console.log('No hay reservas vencidas el día de hoy.');
      }
    } catch (error) {
      console.error('Error ejecutando el cron de reservas:', error);
    }
  });
};