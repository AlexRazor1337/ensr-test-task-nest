import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { Shop } from './entities/shop.entity';

@Controller('shop')
export class ShopController {
  constructor(
    @Inject(forwardRef(() => ShopService))
    private readonly shopService: ShopService,
  ) {}

  @Post()
  async create(
    @Body() createShopDto: CreateShopDto,
  ): Promise<Pick<Shop, 'id'>> {
    const shop = await this.shopService.create(createShopDto);

    return { id: shop.id };
  }

  @Post('fulfill/:id')
  async fulfillPayments(@Param('id') id: number) {
    return this.shopService.fulfillPayments(id);
  }

  @Get()
  findAll(): Promise<Shop[]> {
    return this.shopService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Shop> {
    return this.shopService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateShopDto: UpdateShopDto,
  ): Promise<Shop> {
    await this.shopService.update(+id, updateShopDto);

    return this.shopService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.shopService.remove(+id);

    return;
  }
}
