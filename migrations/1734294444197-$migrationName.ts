import { MigrationInterface, QueryRunner } from "typeorm";

export class $migrationName1734294444197 implements MigrationInterface {
  name = " $migrationName1734294444197";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "food_product_footprints" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "totalCarbonFootprintKg" double precision, "ingredients" character varying NOT NULL, CONSTRAINT "PK_0887b3cb82823c33dbfa52f612a" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "food_product_footprints"`);
  }
}
