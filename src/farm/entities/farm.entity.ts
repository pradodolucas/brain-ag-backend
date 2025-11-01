import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

import { BaseEntity } from '../../database/entities/base.entity';
import { Producer } from '../../producer/entities/producer.entity';
import { Crop } from '../../crop/entities/crop.entity';

@Entity('farms')
export class Farm extends BaseEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'state',
    type: 'varchar',
    length: 2,
    nullable: false,
  })
  state: string;

  @Column({
    name: 'city',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  city: string;

  @Column({
    name: 'total_area',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  totalArea: number;

  @Column({
    name: 'cultivable_area',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  cultivableArea: number;

  @Column({
    name: 'vegetation_area',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  vegetationArea: number;

  // Relacionamentos
  @ManyToOne(() => Producer, (producer) => producer.farms)
  @JoinColumn({ name: 'producer_id' })
  producer: Producer;

  @Column({ name: 'producer_id' })
  producerId: number;

  @OneToMany(() => Crop, (crop) => crop.farm)
  crops: Crop[];
}
