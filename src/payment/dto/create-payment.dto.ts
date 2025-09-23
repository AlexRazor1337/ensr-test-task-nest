import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'ID of the shop where the payment belongs',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  shopId: number;

  @ApiProperty({
    description: 'Payment amount',
    example: 100,
    type: Number,
  })
  @IsNumber()
  @Min(0)
  amount: number;
}
