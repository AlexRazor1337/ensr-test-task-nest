import { IsArray, ArrayNotEmpty, IsNumber } from 'class-validator';

export class UpdatePaymentStatusDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  ids: number[];
}
