import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';
import { PaymentModule } from 'src/payment/payment.module';
import { SystemConfigModule } from 'src/system-config/system-config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shop]),
    PaymentModule,
    SystemConfigModule,
  ],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
