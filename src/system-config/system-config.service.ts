import { Injectable } from '@nestjs/common';
import { CreateSystemConfigDto } from './dto/create-system-config.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemConfig } from './entities/system-config.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SystemConfigService {
  constructor(
    @InjectRepository(SystemConfig)
    private readonly systemConfigRepository: Repository<SystemConfig>,
  ) {}
  async create(createSystemConfigDto: CreateSystemConfigDto) {
    await this.systemConfigRepository.delete(1);
    return this.systemConfigRepository.save({
      ...createSystemConfigDto,
      id: 1,
    });
  }

  findLatest() {
    return this.systemConfigRepository.findOne({ where: { id: 1 } });
  }
}
