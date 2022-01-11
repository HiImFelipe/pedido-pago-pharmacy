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

		return callback(null, pharmacy);
	}

	async getAllPharmacies(
		call: Record<string, any>,
		callback: ICallback
	): Promise<void> {
		const pharmacies = await this.pharmaciesRepository.getAll();

		return callback(null, pharmacies);
	}

	async createPharmacy(
		call: Record<string, any>,
		callback: ICallback
	): Promise<void> {
		const { name } = call.request;

		const pharmacyFound = await this.pharmaciesRepository.getAllByName(name);

		if (pharmacyFound.length > 0) {
			if (pharmacyFound.length > 3) {
				return callback(null, {
					error: "Maximum subsidiaries reached",
				});
			}
			const pharmacy = await this.pharmaciesRepository.save(call.request);

			return callback(null, { ...pharmacy, isSubsidiary: true });
		}
		const pharmacy = await this.pharmaciesRepository.save(call.request);

		return callback(null, pharmacy);
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

		return callback(null, pharmacy);
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
