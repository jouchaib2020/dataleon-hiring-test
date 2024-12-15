import { MigrationInterface, QueryRunner } from "typeorm";

export class  $migrationName1734294862044 implements MigrationInterface {
    name = ' $migrationName1734294862044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "food_product_footprints" DROP COLUMN "ingredients"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "food_product_footprints" ADD "ingredients" character varying NOT NULL`);
    }

}
