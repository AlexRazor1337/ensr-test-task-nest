import { Injectable } from '@nestjs/common';
import { UpdateSystemConfigDto } from './dto/update-system-config.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemConfig } from './entities/system-config.entity';
import { Repository } from 'typeorm';

const STALE_CONFIG_ID = 1;

@Injectable()
export class SystemConfigService {
  constructor(
    @InjectRepository(SystemConfig)
    private readonly systemConfigRepository: Repository<SystemConfig>,
  ) {}
  async update(updateSystemConfigDto: UpdateSystemConfigDto) {
    return this.systemConfigRepository.update(
      STALE_CONFIG_ID,
      updateSystemConfigDto,
    );
  }

  get(): Promise<Omit<SystemConfig, 'id'>> {
    return this.systemConfigRepository
      .findOne({
        where: { id: STALE_CONFIG_ID },
        select: [
          'commissionFixedA',
          'commissionPercentB',
          'blockPercentD',
          'createdAt',
          'updatedAt',
        ],
      })
      .then((config) => {
        return {
          commissionFixedA: Number(config.commissionFixedA),
          commissionPercentB: Number(config.commissionPercentB),
          blockPercentD: Number(config.blockPercentD),
          createdAt: config.createdAt,
          updatedAt: config.updatedAt,
        };
      });
  }
}
