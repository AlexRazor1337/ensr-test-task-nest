import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateShopDto {
  @ApiProperty({
    description: 'Shop name',
    example: 'Shop Name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Shop commission percent',
    example: 10.5,
  })
  @IsNumber({ maxDecimalPlaces: 5 })
  @Min(0)
  commissionPercentC: number;
}
