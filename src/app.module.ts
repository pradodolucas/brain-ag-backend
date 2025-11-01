import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from './database/database.module';

import { ProducerModule } from './producer/producer.module';
import { FarmModule } from './farm/farm.module';
import { CropModule } from './crop/crop.module';

@Module({
  imports: [DatabaseModule, ProducerModule, FarmModule, CropModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
