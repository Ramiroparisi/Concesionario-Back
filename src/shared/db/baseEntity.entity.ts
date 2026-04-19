import { PrimaryKey, Property } from '@mikro-orm/decorators/legacy';

export abstract class BaseEntity {
  
  @PrimaryKey()
  id!: number;

  @Property()
  fechaCreacion: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  fechaActualizacion: Date = new Date();

}