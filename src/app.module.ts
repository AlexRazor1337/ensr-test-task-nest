import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { SystemConfigModule } from './system-config/system-config.module';
import { ShopModule } from './shop/shop.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    SystemConfigModule,
    ShopModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
