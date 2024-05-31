import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Holiday } from './entities/holiday.entity';
import { HolidaysController } from './holidays/holidays.controller';
import { HolidaysModule } from './holidays/holidays.module';
import { HolidaysService } from './holidays/holidays.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'holidays_db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Holiday]),
    HolidaysModule,
  ],
  providers: [HolidaysService],
  controllers: [HolidaysController],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly holidaysService: HolidaysService) {}

  async onModuleInit() {
    await this.holidaysService.initializeHolidays();
  }
}
