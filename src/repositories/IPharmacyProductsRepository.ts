import { PharmacyIndexOptions } from "../../@types/QueryOptions";
import PharmacyProducts from "../entities/PharmacyProducts";

export default interface IPharmacyRepository {
	getById(id: number): Promise<PharmacyProducts | undefined>;
	getAll(
		query?: PharmacyIndexOptions
	): Promise<{ pharmacies: PharmacyProducts[]; totalPharmacies: number }>;
	save(
		pharmacyProducts: Omit<PharmacyProducts, "id">
	): Promise<PharmacyProducts>;
	index(
		query?: PharmacyIndexOptions
	): Promise<{ data: PharmacyProducts[]; count: number }>;
	create(
		pharmacyProducts: Omit<PharmacyProducts, "id">
	): Promise<PharmacyProducts>;
	update(
		id: number,
		pharmacyProducts: Omit<PharmacyProducts, "id">
	): Promise<PharmacyProducts>;
	delete(id: number): Promise<void>;
    deleteByPharmacyId(pharmacyId: string): Promise<void>;
	deleteByProductId(productId: string): Promise<void>;
}
