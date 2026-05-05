import { Entity, Property, Enum, ManyToOne } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import type { Vehiculo } from '../vehiculo/vehiculo.entity.js';

export enum EstadoReserva {
  PENDIENTE_PAGO = 'Pendiente de Pago',
  ACTIVA = 'Activa',
  VENCIDA = 'Vencida',
  FINALIZADA = 'Finalizada',
  CANCELADA = 'Cancelada',
}

export enum EstadoPago {
  PENDIENTE = 'pendiente', 
  APROBADO = 'aprobado',
  RECHAZADO = 'rechazado',
  CANCELADO = 'cancelado',
}

export enum FormaPago {
  EFECTIVO = 'Efectivo',
  MERCADO_PAGO = 'Mercado Pago',
  TRANSFERENCIA = 'Transferencia'
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
  estadoReserva: EstadoReserva = EstadoReserva.PENDIENTE_PAGO;

  @Enum(() => EstadoPago)
  estadoPago: EstadoPago = EstadoPago.PENDIENTE;

  @Property()
  fechaVenc!: Date; 

  @Property({ nullable: true })
  mp_payment_id?: string;

  @Property({ nullable: true })
  mp_preference_id?: string;

  @Property({ nullable: true })
  mp_merchant_order_id?: string;

  @Enum(() => FormaPago)
  formaPago: FormaPago = FormaPago.MERCADO_PAGO;

  @ManyToOne(() => 'Vehiculo' as any)
  vehiculo!: Vehiculo;
}