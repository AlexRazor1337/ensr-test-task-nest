import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';
import { Repository } from 'typeorm';
import { PaymentService } from 'src/payment/payment.service';
import { PaymentStatus } from 'src/payment/entities/payment.entity';
import { SystemConfigService } from 'src/system-config/system-config.service';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,

    private readonly paymentService: PaymentService,

    private readonly systemConfigService: SystemConfigService,
  ) {}
  async create(createShopDto: CreateShopDto) {
    const config = await this.systemConfigService.get();
    const comissionSum =
      createShopDto.commissionPercentC + config.commissionPercentB;

    if (comissionSum >= 1) {
      throw new BadRequestException('Commissions sum must be less than 1');
    }

    return this.shopRepository.save(createShopDto);
  }

  async fulfillPayments(id: number) {
    const shop = await this.findOne(id);

    if (!shop) {
      throw new NotFoundException(`Shop with id ${id} not found`);
    }

    const processedPayments = await this.paymentService.findAllByShopId(
      id,
      PaymentStatus.PROCESSED,
    );

    const completedPayments = await this.paymentService.findAllByShopId(
      id,
      PaymentStatus.COMPLETED,
    );

    const totalAvailableAmount =
      processedPayments.reduce(
        (acc, payment) =>
          acc +
          this.paymentService.calculateAvailableAmount(
            payment.amount,
            payment.commissionA,
            payment.commissionB,
            payment.commissionC,
            payment.blockedD,
          ),
        0,
      ) +
      completedPayments.reduce(
        (acc, payment) =>
          acc +
          this.paymentService.calculateAvailableAmount(
            payment.amount,
            payment.commissionA,
            payment.commissionB,
            payment.commissionC,
          ),
        0,
      );

    const awaitingPayments = [...processedPayments, ...completedPayments];
    awaitingPayments.sort((a, b) => b.amount - a.amount);

    const paymentsToFulfill = [];
    let totalPayedOut = 0;

    awaitingPayments.forEach((payment) => {
      const availableAmount = this.paymentService.calculateAvailableAmount(
        payment.amount,
        payment.commissionA,
        payment.commissionB,
        payment.commissionC,
        payment.status === PaymentStatus.COMPLETED ? 0 : payment.blockedD,
      );
      if (totalPayedOut + availableAmount <= totalAvailableAmount) {
        paymentsToFulfill.push(payment);
        totalPayedOut += availableAmount;
      }
    });

    await this.paymentService.moveStatus(paymentsToFulfill);
    // TODO: Save info that processed payment was fulfilled, so blocked can be paid out later
    return {
      totalPayedOut,
      payedOutPayments: paymentsToFulfill.map((payment) => ({
        id: payment.id,
        amount: this.paymentService.calculateAvailableAmount(
          payment.amount,
          payment.commissionA,
          payment.commissionB,
          payment.commissionC,
          payment.status === PaymentStatus.COMPLETED ? payment.blockedD : 0, // TODO: Currently incorrect
        ),
      })),
    };
  }

  findAll() {
    return this.shopRepository.find();
  }

  findOne(id: number) {
    return this.shopRepository.findOne({ where: { id } });
  }

  update(id: number, updateShopDto: UpdateShopDto) {
    return this.shopRepository.update(id, updateShopDto);
  }

  remove(id: number) {
    return this.shopRepository.delete(id);
  }
}
