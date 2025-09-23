import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { ShopService } from 'src/shop/shop.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { SystemConfigService } from 'src/system-config/system-config.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

    @Inject(forwardRef(() => ShopService))
    private readonly shopService: ShopService,

    private readonly systemConfigService: SystemConfigService,
  ) {}

  calculateMinAmount(
    fixedA: number,
    commissionB: number,
    commissionC: number,
    blockedD: number,
  ): number {
    return (
      fixedA + fixedA * commissionB + fixedA * commissionC + fixedA * blockedD
    );
  }

  calculateAvailableAmount(
    amount: number,
    fixedA: number,
    commissionB: number,
    commissionC: number,
    blockedD = 0,
  ): number {
    return (
      amount -
      fixedA -
      amount * commissionB -
      amount * commissionC -
      amount * blockedD
    );
  }

  async create({ shopId, amount }: CreatePaymentDto): Promise<Payment> {
    const shop = await this.shopService.findOne(shopId);
    if (!shop) {
      throw new NotFoundException(`Shop with id ${shopId} not found`);
    }

    const systemConfig = await this.systemConfigService.get();
    const minAmount = this.calculateMinAmount(
      systemConfig.commissionFixedA,
      systemConfig.commissionPercentB,
      shop.commissionPercentC,
      systemConfig.blockPercentD,
    );
    if (amount < minAmount) {
      throw new BadRequestException(
        `Payment amount must be at least ${minAmount}`,
      );
    }

    const payment = this.paymentRepo.create({
      shop,
      amount,
      status: PaymentStatus.ACCEPTED,
      commissionA: systemConfig.commissionFixedA,
      commissionB: systemConfig.commissionPercentB,
      commissionC: shop.commissionPercentC,
      blockedD: systemConfig.blockPercentD,
    });

    return this.paymentRepo.save(payment);
  }

  async updateStatus(ids: number[], status: PaymentStatus): Promise<Payment[]> {
    const filterStatus =
      status === PaymentStatus.PROCESSED
        ? PaymentStatus.ACCEPTED
        : PaymentStatus.PROCESSED;

    const payments = await this.paymentRepo.find({
      where: {
        id: In(ids),
        status: filterStatus,
      },
    });

    if (!payments.length) {
      throw new NotFoundException('Payments not found');
    }

    // TODO: More status handling logic?
    // Use transaction?
    let paymentsToProcess = [];
    switch (status) {
      case PaymentStatus.PROCESSED:
        paymentsToProcess = payments.filter(
          (payment) => payment.status === PaymentStatus.ACCEPTED,
        );
        break;
      case PaymentStatus.COMPLETED:
        paymentsToProcess = payments.filter(
          (payment) => payment.status === PaymentStatus.PROCESSED,
        );
        break;
      default:
        throw new BadRequestException('Invalid status for processing');
    }

    for (const payment of paymentsToProcess) {
      payment.status = status;
    }

    return this.paymentRepo.save(payments);
  }

  async moveStatus(payments: Payment[]): Promise<void> {
    const paymentsToProcess = payments.map((payment) => {
      switch (payment.status) {
        case PaymentStatus.PROCESSED:
          payment.status = PaymentStatus.COMPLETED;
          break;
        case PaymentStatus.COMPLETED:
          payment.status = PaymentStatus.PAID_OUT;
          break;
        default:
          break;
      }

      return payment;
    });

    await this.paymentRepo.save(paymentsToProcess); // TODO Return
  }

  async findAllByShopId(
    shopId: number,
    status: PaymentStatus,
  ): Promise<Payment[]> {
    return this.paymentRepo.find({ where: { shopId, status } });
  }

  async findById(id: number): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({
      where: { id },
      relations: ['shop'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }

    return payment;
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepo.find({ relations: ['shop'] });
  }
}
