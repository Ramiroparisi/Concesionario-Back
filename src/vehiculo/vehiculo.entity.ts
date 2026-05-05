import { Entity, Property, Enum, ManyToOne, OneToMany} from '@mikro-orm/decorators/legacy';
import { Collection, Cascade} from '@mikro-orm/core';
import type { Modelo } from '../modelo/modelo.entity.js';
import type{ Usuario } from '../usuario/usuario.entity.js'; 
import type { Multimedia } from '../multimedia/multimedia.entity.js'; 
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import type { Reserva } from '../reserva/reserva.entity.js'; 


export enum EstadoVehiculo {
  DISPONIBLE = 'Disponible',
  RESERVADO = 'Reservado',
  VENDIDO = 'Vendido',
}

export enum Moneda {
  USD = 'USD',
  $= 'ARS',
}

@Entity()
export class Vehiculo extends BaseEntity {

  @Property()
  kilometraje!: number;

  @Property()
  anio!: number; 

  @Property({ unique: true , nullable: true})
  patente!: string; 

  @Property()
  color!: string;

  @Property({ type: 'text' })
  descripcion!: string;

  @Property({ type: 'decimal', precision: 12, scale: 2 })
  precio!: number;

  @Enum(() => EstadoVehiculo)
  estado: EstadoVehiculo = EstadoVehiculo.DISPONIBLE; 

  @Enum(() => Moneda)
  moneda: Moneda = Moneda.USD;

  @ManyToOne(() => 'Modelo' as any)
  modelo!: Modelo;

  @ManyToOne(() => 'Usuario' as any, { nullable: true })
  vendedor?: Usuario;

  @OneToMany(() => 'Multimedia' as any, (multimedia: Multimedia) => multimedia.vehiculo, { 
    cascade: [Cascade.ALL], 
    orphanRemoval: true 
  })
  multimedia = new Collection<Multimedia>(this);

  @OneToMany(() => 'Reserva' as any, (reserva: Reserva) => reserva.vehiculo)
  reservas = new Collection<Reserva>(this);
}