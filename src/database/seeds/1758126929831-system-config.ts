import { SystemConfig } from 'src/system-config/entities/system-config.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class SystemConfigSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(SystemConfig);

    await repo.insert([
      {
        id: 1,
        commissionFixedA: 10,
        commissionPercentB: 5,
        blockPercentD: 5,
      },
    ]);
  }
}
