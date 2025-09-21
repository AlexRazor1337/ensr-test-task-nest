import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class CreateSystemConfigDto {
  @ApiProperty({
    description: 'Fixed commission (A)',
    example: 10.5,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  commissionFixedA: number;

  @ApiProperty({
    description: 'Percentage commission (B)',
    example: 2.5,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  commissionPercentB: number;

  @ApiProperty({
    description: 'Block percent (D)',
    example: 15.0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  blockPercentD: number;
}
