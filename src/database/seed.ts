import { DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import AppDataSource from './data-source';

const options: DataSourceOptions & SeederOptions = {
  ...AppDataSource.options,
  seeds: ['src/database/seeds/**/*{.ts,.js}'],
};

export default options;
