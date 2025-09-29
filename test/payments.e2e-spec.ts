import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';
import { CreatePaymentDto } from 'src/payment/dto/create-payment.dto';
import { setup } from 'src/setup';
import { CreateShopDto } from 'src/shop/dto/create-shop.dto';
import { UpdatePaymentStatusDto } from 'src/payment/dto/update-payment-status.dto';
import { PaymentStatus } from 'src/payment/entities/payment.entity';

describe('PaymentController (e2e)', () => {
  let app: INestApplication;
  let shopId: number;

  beforeAll(async () => {
    // Create shop which will be used for payments creation

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    setup(app);
    await app.init();
    const createShopDto: CreateShopDto = {
      name: 'Test Shop',
      commissionPercentC: 0.1,
    };

    const response = await request(app.getHttpServer())
      .post('/api/shop')
      .send(createShopDto);

    shopId = response.body.id;

    await app.close();
  });

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

  it('/payments (POST) - should create a payment', async () => {
    const createPaymentDto: CreatePaymentDto = {
      amount: 100,
      shopId,
    };

    const response = await request(app.getHttpServer())
      .post('/api/payments')
      .send(createPaymentDto)
      .expect(201);

    expect(response.body).toEqual({
      id: expect.any(Number),
    });
  });

  it('/payments (POST) - should not create a payment if amount is less than 0', async () => {
    const createPaymentDto: CreatePaymentDto = {
      amount: -1,
      shopId,
    };

    await request(app.getHttpServer())
      .post('/api/payments')
      .send(createPaymentDto)
      .expect(400);
  });

  it('/payments (POST) - should not create a payment if amount is less than min amount', async () => {
    const createPaymentDto: CreatePaymentDto = {
      amount: 10,
      shopId,
    };

    await request(app.getHttpServer())
      .post('/api/payments')
      .send(createPaymentDto)
      .expect(400);
  });

  it('/payments/processed (patch) - should update payment status and available amount', async () => {
    const updateStatusDto: UpdatePaymentStatusDto = {
      ids: [1],
    };

    await request(app.getHttpServer())
      .patch('/api/payments/processed')
      .send(updateStatusDto)
      .expect(200);

    const payment = await request(app.getHttpServer())
      .get('/api/payments/1')
      .expect(200);

    expect(payment.body.status).toBe(PaymentStatus.PROCESSED);
  });

  it('/payments/completed (patch) - should not move payment to COMPLETED until PROCESSED', async () => {
    const createPaymentDto: CreatePaymentDto = {
      amount: 100,
      shopId,
    };

    await request(app.getHttpServer())
      .post('/api/payments')
      .send(createPaymentDto)
      .expect(201);

    const updateStatusDto: UpdatePaymentStatusDto = {
      ids: [2],
    };

    await request(app.getHttpServer())
      .patch('/api/payments/completed')
      .send(updateStatusDto)
      .expect(404);
  });
});
