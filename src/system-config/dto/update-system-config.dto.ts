import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class UpdateSystemConfigDto {
  @ApiProperty({
    description: 'Fixed commission (A)',
    example: 11,
  })
  @IsNumber({ maxDecimalPlaces: 5 })
  @Min(0, { message: 'Commission must be greater or equal to 0' })
  commissionFixedA: number;

  @ApiProperty({
    description: 'Percentage commission (B)',
    example: 2.5,
  })
  @IsNumber({ maxDecimalPlaces: 5 })
  @Min(0)
  @Max(1)
  commissionPercentB: number;

  @ApiProperty({
    description: 'Block percent (D)',
    example: 15.0,
  })
  @IsNumber({ maxDecimalPlaces: 5 })
  @Min(0)
  @Max(1)
  blockPercentD: number;
}
