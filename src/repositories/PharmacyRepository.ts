import { getRepository, Like, Repository } from "typeorm";

import IPharmacyRepository from "./IPharmacyRepository";
import Pharmacy from "../entities/Pharmacy";
import { PharmacyIndexOptions } from "../../@types/QueryOptions";

class PharmacyRepository implements IPharmacyRepository {
	private ormRepository: Repository<Pharmacy>;

	constructor() {
		this.ormRepository = getRepository(Pharmacy);
	}

	public async getById(id: string): Promise<Pharmacy | undefined> {
		return this.ormRepository.findOne({
			where: { id },
		});
	}

	public async getAll(
		query?: PharmacyIndexOptions
	): Promise<{ pharmacies: Pharmacy[]; totalPharmacies: number }> {
		const take = query && query.take || 10;
		const page = query && query.page || 1;
		const skip = (page - 1) * take;
		const keyword = query && query.keyword || '';

		const [pharmacies, totalPharmacies] = await this.ormRepository.findAndCount(
			{
				where: { name: Like(`%${keyword}%`) },
				order: { name: "DESC" },
				take,
				skip,
			}
		);

		return { pharmacies, totalPharmacies };
	}

	public async getAllByName(name: string): Promise<Pharmacy[]> {
		return this.ormRepository.find({
			where: { name: Like(`%${name}%`) },
		});
	}

	public async save(pharmacy: Pharmacy): Promise<Pharmacy> {
		return this.ormRepository.save(pharmacy);
	}

	public async index(
		query?: PharmacyIndexOptions
	): Promise<{ data: Pharmacy[]; count: number }> {
		const take = query && query.take || 10;
		const page = query && query.page || 1;
		const keyword = query && query.keyword || "";
		const skip = (page - 1) * take;

		const [pharmacyList, totalPharmacies] =
			await this.ormRepository.findAndCount({
				where: { name: Like(`%${keyword}%`) },
				order: { name: "DESC" },
				take,
				skip,
			});

		return {
			data: pharmacyList,
			count: totalPharmacies,
		};
	}

	public async create(pharmacy: Pharmacy): Promise<Pharmacy> {
		const newPharmacy = this.ormRepository.create(pharmacy);

		await this.save(newPharmacy);

		return newPharmacy;
	}

	public async update(
		id: string,
		pharmacy: Omit<Pharmacy, "id">
	): Promise<Pharmacy> {
		const updatedPharmacy = await this.save({ id, ...pharmacy });

		return updatedPharmacy;
	}

	public async delete(id: string): Promise<void> {
		this.ormRepository.delete(id);
	}
}

export default PharmacyRepository;
