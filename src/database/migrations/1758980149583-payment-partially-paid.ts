import { MigrationInterface, QueryRunner } from 'typeorm';

export class PaymentPartiallyPaid1758980149583 implements MigrationInterface {
  name = 'PaymentPartiallyPaid1758980149583';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "partiallyPaid" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payments" DROP COLUMN "partiallyPaid"`,
    );
  }
}
