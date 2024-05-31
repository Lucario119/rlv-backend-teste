import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { Holiday } from '../entities/holiday.entity';
import { HolidaysService } from './holidays.service';

@Controller('feriados')
export class HolidaysController {
  constructor(private readonly holidaysService: HolidaysService) {}

  @Get(':ibgeCode/:date/')
  async getHoliday(
    @Param('ibgeCode') ibgeCode: string,
    @Param('date') date: string,
  ): Promise<Holiday> {
    try {
      return await this.holidaysService.getHoliday(ibgeCode, date);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Put(':ibgeCode/:date/')
  async createOrUpdateHoliday(
    @Param('ibgeCode') ibgeCode: string,
    @Param('date') date: string,
    @Body() body: { name: string },
  ) {
    try {
      await this.holidaysService.createOrUpdateHoliday(
        ibgeCode,
        date,
        body.name,
      );
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':ibgeCode/:date/')
  @HttpCode(204)
  async deleteHoliday(
    @Param('ibgeCode') ibgeCode: string,
    @Param('date') date: string,
  ) {
    try {
      await this.holidaysService.deleteHoliday(ibgeCode, date);

      return { status: 'success' };
    } catch (error) {
      if (
        error.message === 'Cannot delete national holiday' ||
        error.message === 'Cannot delete state holiday from municipality'
      ) {
        throw new HttpException(error.message, HttpStatus.FORBIDDEN);
      } else {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
    }
  }
}
