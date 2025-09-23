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
    await this.systemConfigService.update(updateSystemConfigDto);

    return this.systemConfigService.get();
  }

  @Get()
  get(): Promise<Omit<SystemConfig, 'id'>> {
    return this.systemConfigService.get();
  }
}
