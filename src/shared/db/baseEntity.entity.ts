import { PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { OptionalProps } from '@mikro-orm/core';

export abstract class BaseEntity {
  
  [OptionalProps]?: 'fechaCreacion' | 'fechaActualizacion' | 'id';

  @PrimaryKey()
  id!: number;

  @Property()
  fechaCreacion: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  fechaActualizacion: Date = new Date();

}