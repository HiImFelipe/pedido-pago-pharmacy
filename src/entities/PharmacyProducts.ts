import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import Pharmacy from "./Pharmacy";

@Entity("pharmacy_products")
class PharmacyProducts {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: false })
	productId: string;

	@ManyToOne(() => Pharmacy, (pharmacy) => pharmacy.pharmacyProducts, {onDelete: "CASCADE"})
	pharmacy: Pharmacy;
}

export default PharmacyProducts;
