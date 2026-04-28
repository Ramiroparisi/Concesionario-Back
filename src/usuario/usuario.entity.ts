import { Entity, Property, Enum, OneToMany, BeforeCreate, BeforeUpdate} from '@mikro-orm/decorators/legacy';
import { Collection } from '@mikro-orm/core';
import { Vehiculo } from '../vehiculo/vehiculo.entity.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { hashPassword } from '../shared/utils/password.utils.js';

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

  @Property({ unique: true, nullable: true })
  dni!: string;

  @Property({ nullable: true })
  domicilio!: string;

  @Property({ unique: true, nullable: true })
  cuil!: string;

  @Property({ type: 'date', nullable: true })
  fechaNac!: Date;

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

  @BeforeCreate()
  @BeforeUpdate()
  async hashPasswordHook() {
    if (this.contrasena && !this.contrasena.startsWith('$2b$')) {
      this.contrasena = await hashPassword(this.contrasena); 
    }
  }
}