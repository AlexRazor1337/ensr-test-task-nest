import { MigrationInterface, QueryRunner } from 'typeorm';

export class SystemConfig1758126929831 implements MigrationInterface {
  name = 'SystemConfig1758126929831';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "system_config" ("id" SERIAL NOT NULL, "commissionFixedA" numeric(10,2) NOT NULL DEFAULT '0', "commissionPercentB" numeric(10,2) NOT NULL DEFAULT '0', "blockPercentD" numeric(10,2) NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_db4e70ac0d27e588176e9bb44a0" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "system_config"`);
  }
}
