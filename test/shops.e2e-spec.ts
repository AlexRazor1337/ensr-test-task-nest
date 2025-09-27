import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';
import { CreateShopDto } from 'src/shop/dto/create-shop.dto';
import { setup } from 'src/setup';

describe('ShopController (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setup(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/shop (POST) - should create a shop', async () => {
    const createShopDto: CreateShopDto = {
      name: 'Test Shop',
      commissionPercentC: 0.1,
    };

    const response = await request(app.getHttpServer())
      .post('/api/shop')
      .send(createShopDto)
      .expect(201);

    expect(response.body).toEqual({
      id: expect.any(Number),
    });
  });

  it('/shop (POST) - should return error for invalid name', async () => {
    const createShopDto: CreateShopDto = {
      name: '',
      commissionPercentC: 0.1,
    };

    await request(app.getHttpServer())
      .post('/api/shop')
      .send(createShopDto)
      .expect(400);
  });

  it('/shop (POST) - should return error for invalid commission percent', async () => {
    const createShopDto: CreateShopDto = {
      name: 'Test Shop',
      commissionPercentC: -0.1,
    };

    await request(app.getHttpServer())
      .post('/api/shop')
      .send(createShopDto)
      .expect(400);
  });

  it('/shop (POST) - should not create a shop if commission sum is greater than 1', async () => {
    const createShopDto: CreateShopDto = {
      name: 'Test Shop',
      commissionPercentC: 0.9,
    };

    await request(app.getHttpServer())
      .post('/api/shop')
      .send(createShopDto)
      .expect(400);
  });
});
