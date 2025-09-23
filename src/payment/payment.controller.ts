import { Controller, Post, Patch, Body, Param, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { Payment, PaymentStatus } from './entities/payment.entity';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async create(@Body() dto: CreatePaymentDto): Promise<{ id: number }> {
    const payment = await this.paymentService.create(dto);
    return { id: payment.id };
  }

  @Patch('processed')
  async markProcessed(@Body() dto: UpdatePaymentStatusDto) {
    const payments = await this.paymentService.updateStatus(
      dto.ids,
      PaymentStatus.PROCESSED,
    );
    return { updated: payments.map((payment) => payment.id) };
  }

  @Patch('completed')
  async markCompleted(@Body() dto: UpdatePaymentStatusDto) {
    const payments = await this.paymentService.updateStatus(
      dto.ids,
      PaymentStatus.COMPLETED,
    );
    return { updated: payments.map((payment) => payment.id) };
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<Payment> {
    return this.paymentService.findById(id);
  }
}
