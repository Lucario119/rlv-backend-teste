import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Holiday {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ibgeCode: string;

  @Column()
  date: string;

  @Column()
  name: string;
}
