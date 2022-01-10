import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("pharmacies")
class Pharmacy {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	name: string;

	@Column()
	logo: string;

	@Column()
	city: string;

	@Column()
	uf: string;

	@Column()
	cep: string;

	@Column()
	address: string;

	@Column()
	phone: string;

	@Column()
	cnpj: string;

	@Column()
	openingTime: string;

	@Column()
	closingTime: string;

	@Column()
	responsibleName: string;
}

export default Pharmacy;
