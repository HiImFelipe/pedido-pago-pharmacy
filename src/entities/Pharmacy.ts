import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
} from "typeorm";

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

	@CreateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP(6)",
	})
	public createdAt: Date;

	@UpdateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP(6)",
		onUpdate: "CURRENT_TIMESTAMP(6)",
	})
	public updatedAt: Date;
}

export default Pharmacy;
