import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../database/entities/base.entity';
import { Farm } from '../../farm/entities/farm.entity';

@Entity('producers')
export class Producer extends BaseEntity {
  @Column({
    name: 'tax_id',
    type: 'varchar',
    length: 14,
    nullable: false,
    unique: true,
  })
  taxId: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  // Relacionamentos
  @OneToMany(() => Farm, (farm) => farm.producer)
  farms: Farm[];
}
