import { getRepository, Like, Repository } from "typeorm";

import IPharmacyProductsRepository from "./IPharmacyProductsRepository";
import PharmacyProducts from "../entities/PharmacyProducts";
import { PharmacyIndexOptions } from "../../@types/QueryOptions";

class PharmacyProductsRepository implements IPharmacyProductsRepository {
	private ormRepository: Repository<PharmacyProducts>;

	constructor() {
		this.ormRepository = getRepository(PharmacyProducts);
	}

	public async getById(id: number): Promise<PharmacyProducts | undefined> {
		return this.ormRepository.findOne({
			where: { id },
		});
	}

	public async getAll(
		query?: PharmacyIndexOptions
	): Promise<{ pharmacies: PharmacyProducts[]; totalPharmacies: number }> {
		const take = (query && query.take) || 10;
		const page = (query && query.page) || 1;
		const skip = (page - 1) * take;

		const [pharmacies, totalPharmacies] = await this.ormRepository.findAndCount(
			{
				take,
				skip,
			}
		);

		return { pharmacies, totalPharmacies };
	}

	public async getAllByName(name: string): Promise<PharmacyProducts[]> {
		return this.ormRepository.find({
			where: { name: Like(`%${name}%`) },
		});
	}

	public async save(
		pharmacyProducts: PharmacyProducts
	): Promise<PharmacyProducts> {
		return this.ormRepository.save(pharmacyProducts);
	}

	public async index(
		query?: PharmacyIndexOptions
	): Promise<{ data: PharmacyProducts[]; count: number }> {
		const take = (query && query.take) || 10;
		const page = (query && query.page) || 1;
		const skip = (page - 1) * take;

		const [pharmacyProductsList, totalPharmacies] =
			await this.ormRepository.findAndCount({
				take,
				skip,
			});

		return {
			data: pharmacyProductsList,
			count: totalPharmacies,
		};
	}

	public async create(
		pharmacyProducts: PharmacyProducts
	): Promise<PharmacyProducts> {
		return this.ormRepository.create(pharmacyProducts);
	}

	public async update(
		id: number,
		pharmacyProducts: Omit<PharmacyProducts, "id">
	): Promise<PharmacyProducts> {
		const updatedPharmacyProducts = await this.save({
			id,
			...pharmacyProducts,
		});

		return updatedPharmacyProducts;
	}

	public async delete(id: number): Promise<void> {
		this.ormRepository.delete(id);
	}

    public async deleteByPharmacyId(pharmacyId: string): Promise<void> {
        this.ormRepository.delete({
            pharmacy: {
                id: pharmacyId,
            }
        });
    }
}

export default PharmacyProductsRepository;
