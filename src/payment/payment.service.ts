import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { ShopService } from 'src/shop/shop.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

    private readonly shopService: ShopService,
  ) {}

  async create({ shopId, amount }: CreatePaymentDto): Promise<Payment> {
    const shop = await this.shopService.findOne(shopId);
    if (!shop) {
      throw new NotFoundException(`Shop with id ${shopId} not found`);
    }

    const payment = this.paymentRepo.create({
      shop,
      amount,
      status: PaymentStatus.ACCEPTED,
    });

    return this.paymentRepo.save(payment);
  }

  async updateStatus(ids: number[], status: PaymentStatus): Promise<void> {
    const payments = await this.paymentRepo.find({ where: { id: In(ids) } });

    if (!payments.length) {
      throw new NotFoundException('Payments not found');
    }

    for (const payment of payments) {
      payment.status = status;
    }

    await this.paymentRepo.save(payments);
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
