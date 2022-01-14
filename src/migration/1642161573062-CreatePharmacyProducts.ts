import {MigrationInterface, QueryRunner} from "typeorm";

export class CreatePharmacyProducts1642161573062 implements MigrationInterface {
    name = 'CreatePharmacyProducts1642161573062'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`pharmacy_products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`productId\` varchar(255) NOT NULL, \`pharmacyId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`pharmacy_products\` ADD CONSTRAINT \`FK_ced148aee8c3e0c53d4d592c721\` FOREIGN KEY (\`pharmacyId\`) REFERENCES \`pharmacies\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pharmacy_products\` DROP FOREIGN KEY \`FK_ced148aee8c3e0c53d4d592c721\``);
        await queryRunner.query(`DROP TABLE \`pharmacy_products\``);
    }

}
