import { Entity, Property, Enum, ManyToOne } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Vehiculo } from '../vehiculo/vehiculo.entity.js';

export enum EstadoReserva {
  ACTIVA = 'Activa',
  VENCIDA = 'Vencida',
  FINALIZADA = 'Finalizada',
}

@Entity()
export class Reserva extends BaseEntity {

  @Property()
  nombreCli!: string;

  @Property()
  apellidoCli!: string;

  @Property()
  dni!: string;

  @Property()
  mail!: string;

  @Property()
  telefono!: string;

  @Property({ type: 'decimal', precision: 12, scale: 0 })
  importe!: number;

  @Enum(() => EstadoReserva)
  estado: EstadoReserva = EstadoReserva.ACTIVA;

  @Property()
  fechaVenc!: Date; 

  @Property({ nullable: true })
  mp_payment_id?: string;

  @Property({ nullable: true })
  mp_preference_id?: string;

  @ManyToOne(() => Vehiculo)
  vehiculo!: Vehiculo;
}