import { Module } from '@nestjs/common';
import { SystemConfigService } from './system-config.service';
import { SystemConfigController } from './system-config.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemConfig } from './entities/system-config.entity';

@Module({
  controllers: [SystemConfigController],
  providers: [SystemConfigService],
  imports: [TypeOrmModule.forFeature([SystemConfig])],
})
export class SystemConfigModule {}
