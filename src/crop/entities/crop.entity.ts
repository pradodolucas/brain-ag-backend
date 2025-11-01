import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { BaseEntity } from '../../database/entities/base.entity';
import { Farm } from '../../farm/entities/farm.entity';

@Entity('crops')
export class Crop extends BaseEntity {
  @Column({
    name: 'year',
    type: 'int',
    nullable: false,
  })
  year: number;

  @Column({
    name: 'food',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  food: string;

  @ManyToOne(() => Farm, (farm) => farm.crops)
  @JoinColumn({ name: 'farm_id' })
  farm: Farm;

  @Column({ name: 'farm_id' })
  farmId: number;
}
