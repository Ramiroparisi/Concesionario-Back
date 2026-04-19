import { Entity, Property, Enum, OneToMany} from '@mikro-orm/decorators/legacy';
import { Collection } from '@mikro-orm/core';
import { Vehiculo } from '../vehiculo/vehiculo.entity.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';

export enum RolUsuario{
  ADMIN = 'Admin',
  EMPLEADO = 'Empleado',
}

@Entity()
export class Usuario extends BaseEntity{

  @Property({ unique: true })
  mail!: string;

  @Property({ hidden: true })
  contrasena!: string;

  @Property()
  nombre!: string;

  @Property()
  apellido!: string;

  @Property()
  telefono!: string;

  @Enum(() => RolUsuario)
  rol: RolUsuario = RolUsuario.EMPLEADO;

  @OneToMany(() => Vehiculo, (vehiculo) => vehiculo.vendedor)
  vehiculosVendidos = new Collection<Vehiculo>(this);
}