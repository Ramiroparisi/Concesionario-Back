import { Entity, Property, ManyToOne, OneToMany, Unique } from '@mikro-orm/decorators/legacy';
import { Cascade, Collection } from '@mikro-orm/core';
import { Marca } from '../marca/marca.entity.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Vehiculo } from '../vehiculo/vehiculo.entity.js';

@Entity()
export class Modelo extends BaseEntity {

  @Property({unique: true})
  nombre!: string;

  @Property()
  cantPuertas!: number;

  @Property()
  combustible!: string;

  @Property()
  motor!: string;

  @Property()
  potencia!: number;

  @Property()
  transmision!: string;

  @ManyToOne(() => Marca)
  marca!: Marca;

  @OneToMany(() => Vehiculo, (vehiculo) => vehiculo.modelo, { 
    cascade: [Cascade.ALL] 
  })
  vehiculos = new Collection<Vehiculo>(this);
}