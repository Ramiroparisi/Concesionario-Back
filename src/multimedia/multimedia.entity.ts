import { Entity, Property, ManyToOne } from '@mikro-orm/decorators/legacy';
import type { Vehiculo } from '../vehiculo/vehiculo.entity.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';

@Entity()
export class Multimedia extends BaseEntity {

  @Property()
  archivo!: string;

  @Property()
  orden!: number;

  @ManyToOne(() => 'Vehiculo' as any)
  vehiculo!: Vehiculo;
}