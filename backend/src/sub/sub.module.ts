import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubController } from './sub.controller';
import { Sub } from './sub.entity';
import { SubService } from './sub.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sub])],
  controllers: [SubController],
  providers: [SubService],
})
export class SubModule {}
