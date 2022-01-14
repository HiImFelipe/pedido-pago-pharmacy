import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
} from "typeorm";
import Pharmacy_Products from "./PharmacyProducts";

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

	@Column("boolean", { default: false })
	isSubsidiary: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@OneToMany(
		() => Pharmacy_Products,
		(pharmacy_products) => pharmacy_products.pharmacy
	)
	products: Pharmacy_Products[];
}

export default Pharmacy;
