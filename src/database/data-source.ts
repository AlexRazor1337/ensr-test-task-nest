import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { SeederOptions } from 'typeorm-extension';

config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  synchronize: false,
  seeds: ['src/database/seeds/**/*{.ts,.js}'],
};

const AppDataSource = new DataSource(options);

export default AppDataSource;
