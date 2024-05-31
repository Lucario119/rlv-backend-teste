import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Holiday } from '../entities/holiday.entity';
import { HolidaysService } from './holidays.service';

@Module({
  providers: [HolidaysService],
  imports: [TypeOrmModule.forFeature([Holiday])],
})
export class HolidaysModule {}
