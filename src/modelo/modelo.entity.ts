import { Entity, Property, ManyToOne } from '@mikro-orm/decorators/legacy';
import { Marca } from '../marca/marca.entity.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';

@Entity()
export class Modelo extends BaseEntity {

  @Property()
  nombre!: string;

  @Property()
  cantPuertas!: number;

  @Property()
  combustible!: string;

  @Property()
  motor!: string;

  @Property()
  transmision!: string;

  @ManyToOne(() => Marca)
  marca!: Marca;
}