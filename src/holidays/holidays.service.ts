import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Holiday } from '../entities/holiday.entity';
import { calculateEaster } from '../utils/easterDate';
import { formatDate } from '../utils/formatDate';

@Injectable()
export class HolidaysService {
  constructor(
    @InjectRepository(Holiday)
    private holidaysRepository: Repository<Holiday>,
  ) {}
  public nationalHolidays = [
    { date: '01-01', name: 'Ano Novo' },
    { date: '04-21', name: 'Tiradentes' },
    { date: '05-01', name: 'Dia do Trabalhador' },
    { date: '09-07', name: 'Independência' },
    { date: '10-12', name: 'Nossa Senhora Aparecida' },
    { date: '11-02', name: 'Finados' },
    { date: '11-15', name: 'Proclamação da República' },
    { date: '12-25', name: 'Natal' },
  ];

  async getHoliday(ibgeCode: string, date: string): Promise<Holiday> {
    const formattedDateParam = date.replace(/\d{4}-/, '');
    const holiday = await this.holidaysRepository.findOne({
      where: [
        {
          ibgeCode: Like(`%${ibgeCode}%`),
          date: Like(`%${formattedDateParam}%`),
        },
      ],
    });

    const holidayByDate = await this.holidaysRepository.findOne({
      where: [
        {
          date: Like(`%${formattedDateParam}%`),
        },
      ],
    });

    if (!holiday && !holidayByDate) {
      throw new Error('holiday not found');
    }
    return holidayByDate ? holidayByDate : holiday;
  }

  async createOrUpdateHoliday(
    ibgeCode: string,
    date: string,
    name: string,
  ): Promise<void> {
    let holiday = await this.holidaysRepository.findOne({
      where: { ibgeCode, date },
    });
    if (!holiday) {
      holiday = new Holiday();
      holiday.ibgeCode = ibgeCode;
      holiday.date = date;
    }

    holiday.name = name || date;
    await this.holidaysRepository.save(holiday);
  }

  async deleteHoliday(ibgeCode: string, date: string): Promise<void> {
    const formattedDateParam = date.replace(/\d{4}-/, '');
    const holiday = await this.holidaysRepository.findOne({
      where: [
        {
          ibgeCode: Like(`%${ibgeCode}%`),
          date: Like(`%${formattedDateParam}%`),
        },
      ],
    });
    const holidayByDate = await this.holidaysRepository.findOne({
      where: [
        {
          date: Like(`%${formattedDateParam}%`),
        },
      ],
    });

    if (!holiday && !holidayByDate) {
      throw new Error('holiday not found');
    }

    if (this.nationalHolidays.some((item) => item.date.includes(date))) {
      throw new Error('Cannot delete national holiday');
    }

    if (ibgeCode.length === 7) {
      const stateCode = ibgeCode.substring(0, 2);
      const stateHoliday = await this.holidaysRepository.findOne({
        where: [
          {
            ibgeCode: Like(`%${stateCode}%`),
          },
        ],
      });

      if (stateHoliday) {
        throw new Error('Cannot delete state holiday from municipality');
      }
    }

    await this.holidaysRepository.remove(holiday || holidayByDate);
  }

  async initializeHolidays(): Promise<void> {
    const movableHolidays: any[] = [];

    for (let i = 1; i <= 4; i++) {
      movableHolidays.push(
        await this.calculateMovableHolidays(new Date().getFullYear() - i),
      );
    }

    const holidays = [...this.nationalHolidays, ...movableHolidays.flat(1)];

    for (const holiday of holidays) {
      const formattedDateParam = holiday.date?.replace(/\d{4}-/, '');
      const existingHoliday = await this.holidaysRepository.findOne({
        where: { date: formattedDateParam },
      });
      if (!existingHoliday) {
        await this.holidaysRepository.save({
          ...holiday,
          ibgeCode: '0000000',
        });
      }
    }
  }

  async calculateMovableHolidays(year: number): Promise<any[]> {
    const easterDate = calculateEaster(year);

    const carnivalDate = new Date(easterDate);
    carnivalDate.setDate(easterDate.getDate() - 47);

    const goodFridayDate = new Date(easterDate);
    goodFridayDate.setDate(easterDate.getDate() - 2);

    const corpusChristiDate = new Date(easterDate);
    corpusChristiDate.setDate(easterDate.getDate() + 60);

    return [
      {
        date: `${formatDate(goodFridayDate)}`,
        name: 'Sexta-Feira Santa',
        ibgeCode: '1111111',
      },
      {
        date: `${formatDate(carnivalDate)}`,
        name: 'Carnaval',
        ibgeCode: '1111111',
      },
      {
        date: `${formatDate(corpusChristiDate)}`,
        name: 'Corpus Christi',
        ibgeCode: '1111111',
      },
      {
        date: `${formatDate(easterDate)}`,
        name: 'Páscoa',
        ibgeCode: '1111111',
      },
    ];
  }
}
