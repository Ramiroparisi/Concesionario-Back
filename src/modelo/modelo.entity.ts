import { Entity, Property, ManyToOne, OneToMany, Unique } from '@mikro-orm/decorators/legacy';
import { Cascade, Collection } from '@mikro-orm/core';
import type { Marca } from '../marca/marca.entity.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import type { Vehiculo } from '../vehiculo/vehiculo.entity.js';

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

  @ManyToOne(() => 'Marca' as any)
  marca!: Marca;

  @OneToMany(() => 'Vehiculo' as any, (vehiculo: Vehiculo) => vehiculo.modelo, { 
    cascade: [Cascade.ALL] 
  })
  vehiculos = new Collection<Vehiculo>(this);
}