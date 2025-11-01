import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProducerService } from './producer.service';
import { ProducerController } from './producer.controller';
import { Producer } from './entities/producer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producer])],
  controllers: [ProducerController],
  providers: [ProducerService],
  exports: [ProducerService],
})
export class ProducerModule {}
