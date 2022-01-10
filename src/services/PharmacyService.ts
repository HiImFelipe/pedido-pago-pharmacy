import { injectable, inject } from "tsyringe";
import IPharmacyRepository from "../repositories/IPharmacyRepository";
import { IPharmacyService } from "./IPharmacyService";

@injectable()
export class PharmacyService implements IPharmacyService {
	constructor(
		@inject("PharmaciesRepository")
		private pharmaciesRepository: IPharmacyRepository
	) {}

	async getPharmacy(
		call: Record<string, any>,
		callback: ICallback
	): Promise<void> {
		const { id } = call.request;

		const pharmacy = await this.pharmaciesRepository.getById(id);

		if (!pharmacy) {
			return callback(null, { error: "Pharmacy not found!" });
		}

		return callback(null, { ...pharmacy, password: undefined });
	}

	async getAllPharmacies(
		call: Record<string, any>,
		callback: ICallback
	): Promise<any> {
		const pharmacies = await this.pharmaciesRepository.getAll();

		return callback(null, pharmacies);
	}

	async createPharmacy(
		call: Record<string, any>,
		callback: ICallback
	): Promise<void> {
		const { name } = call.request;

		const pharmacyFound = await this.pharmaciesRepository.getAllByName(name);

		if (pharmacyFound) {
			return callback(null, { error: "Pharmacy already exists!" });
		}

		const pharmacy = await this.pharmaciesRepository.create(call.request);

		return callback(null, { ...pharmacy, password: undefined });
	}

	async updatePharmacy(
		call: Record<string, any>,
		callback: ICallback
	): Promise<void> {
		const { id } = call.request;

		const pharmacyFound = await this.pharmaciesRepository.getById(id);

		if (!pharmacyFound) {
			return callback(null, { error: "Pharmacy not found!" });
		}

		const pharmacy = await this.pharmaciesRepository.update(id, call.request);

		return callback(null, { ...pharmacy, password: undefined });
	}

	async deletePharmacy(
		call: Record<string, any>,
		callback: ICallback
	): Promise<void> {
		const { id } = call.request;

		const pharmacyFound = await this.pharmaciesRepository.getById(id);

		if (!pharmacyFound) {
			return callback(null, { error: "Pharmacy not found!" });
		}

		await this.pharmaciesRepository.delete(id);

		return callback(null, {});
	}
}
