import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmService } from './farm.service';
import { FarmController } from './farm.controller';
import { Farm } from './entities/farm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Farm])],
  controllers: [FarmController],
  providers: [FarmService],
  exports: [FarmService],
})
export class FarmModule {}
