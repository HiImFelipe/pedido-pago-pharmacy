import {MigrationInterface, QueryRunner} from "typeorm";

export class CreatePharmacy1642123335853 implements MigrationInterface {
    name = 'CreatePharmacy1642123335853'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pharmacies\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`pharmacies\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`pharmacies\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`pharmacies\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pharmacies\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`pharmacies\` ADD \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`pharmacies\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`pharmacies\` ADD \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

}
