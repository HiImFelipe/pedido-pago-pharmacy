import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
} from "typeorm";
import PharmacyProducts from "./PharmacyProducts";

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
		() => PharmacyProducts,
		(pharmacy_products) => pharmacy_products.pharmacy,
		{ cascade: true }
	)
	pharmacyProducts: PharmacyProducts[];
}

export default Pharmacy;
