import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';
import { CreateShopDto } from 'src/shop/dto/create-shop.dto';
import { setup } from 'src/setup';
import { CreatePaymentDto } from 'src/payment/dto/create-payment.dto';
import { Payment } from 'src/payment/entities/payment.entity';
import { SystemConfig } from 'src/system-config/entities/system-config.entity';
import { Shop } from 'src/shop/entities/shop.entity';

describe('ShopController (e2e)', () => {
  let app: INestApplication;
  let fulfillShop: Shop;
  let processedPayment: Payment;
  let config: SystemConfig;

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

  it('/shop/:id/fulfill (POST) - should throw NotFoundException if shop with id does not exist', async () => {
    const id = 999;

    await request(app.getHttpServer())
      .post(`/api/shop/${id}/fulfill`)
      .expect(404);
  });

  it('/shop/:id/fulfill (POST) - should return empty array if there are no processed payments', async () => {
    const createShopDto: CreateShopDto = {
      name: 'Test Shop',
      commissionPercentC: 0.1,
    };

    const shopResponse = await request(app.getHttpServer())
      .post('/api/shop')
      .send(createShopDto)
      .expect(201);

    fulfillShop = shopResponse.body;

    const response = await request(app.getHttpServer()).post(
      `/api/shop/${fulfillShop.id}/fulfill`,
    );

    expect(response.body).toEqual({
      totalPayedOut: 0,
      payedOutPayments: [],
    });
  });

  it('/shop/:id/fulfill (POST) - should fullfil processed payments without blocked amount', async () => {
    const configResponse = await request(app.getHttpServer())
      .get(`/api/system-config`)
      .expect(200);
    config = configResponse.body;

    const shopResponse = await request(app.getHttpServer())
      .get(`/api/shop/${fulfillShop.id}`)
      .expect(200);
    const shop: Shop = shopResponse.body;

    const createPaymentDto: CreatePaymentDto = {
      amount: 100,
      shopId: fulfillShop.id,
    };

    const paymentResponse = await request(app.getHttpServer())
      .post('/api/payments')
      .send(createPaymentDto)
      .expect(201);

    processedPayment = {
      ...paymentResponse.body,
      amount: createPaymentDto.amount,
    };

    await request(app.getHttpServer())
      .patch('/api/payments/processed')
      .send({ ids: [processedPayment.id] })
      .expect(200);

    const response = await request(app.getHttpServer())
      .post(`/api/shop/${fulfillShop.id}/fulfill`)
      .expect(200);

    const expectedAmount =
      createPaymentDto.amount -
      createPaymentDto.amount * config.blockPercentD -
      createPaymentDto.amount * shop.commissionPercentC -
      createPaymentDto.amount * config.commissionPercentB -
      config.commissionFixedA;

    expect(response.body).toEqual({
      totalPayedOut: expectedAmount,
      payedOutPayments: [
        {
          id: processedPayment.id,
          amount: expectedAmount,
        },
      ],
    });
  });

  it('/shop/:id/fulfill (POST) - should fullfil completed payments with blocked amount', async () => {
    await request(app.getHttpServer())
      .patch('/api/payments/completed')
      .send({ ids: [processedPayment.id] })
      .expect(200);

    const response = await request(app.getHttpServer())
      .post(`/api/shop/${fulfillShop.id}/fulfill`)
      .expect(200);

    const expectedAmount = processedPayment.amount * config.blockPercentD;
    expect(response.body).toEqual({
      totalPayedOut: expectedAmount,
      payedOutPayments: [
        {
          id: processedPayment.id,
          amount: expectedAmount,
        },
      ],
    });
  });
});
