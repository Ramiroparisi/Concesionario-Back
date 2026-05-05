import { Entity, Property, OneToMany, Unique } from '@mikro-orm/decorators/legacy';
import { Collection, Cascade } from '@mikro-orm/core';
import type { Modelo } from '../modelo/modelo.entity.js'; 
import { BaseEntity } from '../shared/db/baseEntity.entity.js';

@Entity()
export class Marca extends BaseEntity {

  @Property({ unique: true })
  nombre!: string;

  @OneToMany(() => 'Modelo' as any, (modelo: Modelo) => modelo.marca, { 
    cascade: [Cascade.ALL], 
    orphanRemoval: true 
  })
  modelos = new Collection<Modelo>(this);

}
