import {MigrationInterface, QueryRunner} from "typeorm";

export class CreatePharmacy1641956241581 implements MigrationInterface {
    name = 'CreatePharmacy1641956241581'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`pharmacies\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`logo\` varchar(255) NOT NULL, \`city\` varchar(255) NOT NULL, \`uf\` varchar(255) NOT NULL, \`cep\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`cnpj\` varchar(255) NOT NULL, \`openingTime\` varchar(255) NOT NULL, \`closingTime\` varchar(255) NOT NULL, \`responsibleName\` varchar(255) NOT NULL, \`isSubsidiary\` tinyint NOT NULL DEFAULT 0, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`pharmacies\``);
    }

}
