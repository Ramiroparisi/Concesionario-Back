import { Entity, Property, Enum, ManyToOne, OneToMany} from '@mikro-orm/decorators/legacy';
import { Collection, Cascade} from '@mikro-orm/core';
import { Modelo } from '../modelo/modelo.entity.js';
import { Usuario } from '../usuario/usuario.entity.js'; 
import { Multimedia } from '../multimedia/multimedia.entity.js'; 
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Reserva } from '../reserva/reserva.entity.js'; 


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

  @Property({ unique: true })
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

  @ManyToOne(() => Modelo)
  modelo!: Modelo;

  @ManyToOne(() => Usuario, { nullable: true })
  vendedor?: Usuario;

  @OneToMany(() => Multimedia, (multimedia) => multimedia.vehiculo, { 
    cascade: [Cascade.ALL], 
    orphanRemoval: true 
  })
  multimedia = new Collection<Multimedia>(this);

  @OneToMany(() => Reserva, (reserva) => reserva.vehiculo)
  reservas = new Collection<Reserva>(this);
}