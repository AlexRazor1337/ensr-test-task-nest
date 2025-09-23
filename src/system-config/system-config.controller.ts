import { Controller, Get, Body, Put } from '@nestjs/common';
import { SystemConfigService } from './system-config.service';
import { UpdateSystemConfigDto } from './dto/update-system-config.dto';
import { SystemConfig } from './entities/system-config.entity';

@Controller('system-config')
export class SystemConfigController {
  constructor(private readonly systemConfigService: SystemConfigService) {}

  @Put()
  async update(
    @Body() updateSystemConfigDto: UpdateSystemConfigDto,
  ): Promise<Omit<SystemConfig, 'id'>> {
    if (
      updateSystemConfigDto.commissionFixedA +
        updateSystemConfigDto.commissionPercentB >=
      1
    ) {
      throw new Error('Commissions sum must be less than 1');
    }

    await this.systemConfigService.update(updateSystemConfigDto);

    return this.systemConfigService.get();
  }

  @Get()
  get(): Promise<Omit<SystemConfig, 'id'>> {
    return this.systemConfigService.get();
  }
}
