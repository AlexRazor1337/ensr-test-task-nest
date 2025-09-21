import { Injectable } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
  ) {}
  create(createShopDto: CreateShopDto) {
    return this.shopRepository.save(createShopDto);
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
