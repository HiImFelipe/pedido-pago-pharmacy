import { injectable, inject } from "tsyringe";
import { ICallback } from "../../@types/Proto";
import { ProductClient } from "../clients/Product";
import Pharmacy from "../entities/Pharmacy";
import IPharmacyRepository from "../repositories/IPharmacyRepository";
import IPharmacyProductsRepository from "../repositories/IPharmacyProductsRepository";
import { IPharmacyService } from "./IPharmacyService";

type PharmacyWithProducts = Partial<Pharmacy> & { products: any[] };

@injectable()
export class PharmacyService implements IPharmacyService {
	constructor(
		@inject("PharmacyRepository")
		private pharmacyRepository: IPharmacyRepository,
		@inject("PharmacyProductsRepository")
		private pharmacyProductsRepository: IPharmacyProductsRepository
	) {}

	private async getProductsData(
		productIds: string[],
		callback: ICallback
	): Promise<{ products: any[]; totalProducts: number } | undefined> {
		try {
			return await ProductClient.getProductsByIds({
				productIds,
			});
		} catch (error: any) {
			callback(error, null);
		}
	}

	async getPharmacy(
		call: Record<string, any>,
		callback: ICallback
	): Promise<void> {
		try {
			const { id } = call.request;

			const pharmacy = await this.pharmacyRepository.getById(id, {
				relations: ["pharmacyProducts"],
			});

			if (!pharmacy) {
				return callback(new Error("Pharmacy not found!"), null);
			}

			const productsWithTotal = await this.getProductsData(
				pharmacy.pharmacyProducts?.map(
					(PharmacyProduct) => PharmacyProduct.productId
				),
				callback
			);

			const pharmacyWithProducts: PharmacyWithProducts = {
				...pharmacy,
				products: productsWithTotal?.products || [],
			};

			return callback(null, {
				...pharmacyWithProducts,
				createdAt: pharmacy.createdAt.toISOString(),
				updatedAt: pharmacy.updatedAt.toISOString(),
			});
		} catch (error: any) {
			return callback(error, null);
		}
	}

	async getAllPharmacies(
		call: Record<string, any>,
		callback: ICallback
	): Promise<void> {
		try {
			const { pharmacies, totalPharmacies } =
				await this.pharmacyRepository.getAll();

			const parsedPharmacies = pharmacies.map((pharmacy) => ({
				...pharmacy,
				createdAt: pharmacy.createdAt.toISOString(),
				updatedAt: pharmacy.updatedAt.toISOString(),
			}));

			return callback(null, { pharmacies: parsedPharmacies, totalPharmacies });
		} catch (error: any) {
			return callback(error, null);
		}
	}

	async createPharmacy(
		call: Record<string, any>,
		callback: ICallback
	): Promise<void> {
		const { name, productIds } = call.request;
		let products: any[] | undefined = [];

		try {
			const pharmacyFound = await this.pharmacyRepository.getAllByName(name);

			if (productIds) {
				const productsWithTotal = await this.getProductsData(
					productIds,
					callback
				);

				if (productsWithTotal && +productsWithTotal.totalProducts === 0) {
					return callback(new Error("No productIds are valid"), null);
				}

				products = productsWithTotal?.products;
			}

			if (pharmacyFound.length > 0) {
				if (pharmacyFound.length > 3)
					return callback(new Error("Maximum subsidiaries reached"), null);

				const pharmacy = await this.pharmacyRepository.save(call.request);
				if (Array.isArray(productIds)) {
					await Promise.all(
						productIds?.map((productId: string) =>
							this.pharmacyProductsRepository.save({
								productId,
								pharmacy,
							})
						)
					);
				}

				return callback(null, {
					...pharmacy,
					products: products || [],
					createdAt: pharmacy.createdAt.toISOString(),
					updatedAt: pharmacy.updatedAt.toISOString(),
					isSubsidiary: true,
				});
			}

			const pharmacy = await this.pharmacyRepository.save({
				...call.request,
			});
			if (Array.isArray(productIds)) {
				await Promise.all(
					productIds.map((productId: string) =>
						this.pharmacyProductsRepository.save({
							productId,
							pharmacy,
						})
					)
				);
			}

			return callback(null, {
				...pharmacy,
				products,
				createdAt: pharmacy.createdAt.toISOString(),
				updatedAt: pharmacy.updatedAt.toISOString(),
			});
		} catch (error: any) {
			return callback(error, null);
		}
	}

	async updatePharmacy(
		call: Record<string, any>,
		callback: ICallback
	): Promise<void> {
		try {
			const { id, ...request } = call.request;
			let products;

			const pharmacyFound = await this.pharmacyRepository.getById(id);

			if (!pharmacyFound) {
				return callback(new Error("Pharmacy not found!"), null);
			}

			if (call.request.productIds?.length > 0) {
				const productsWithTotal = await this.getProductsData(
					call.request.productIds,
					callback
				);

				if (productsWithTotal && +productsWithTotal.totalProducts === 0) {
					return callback(new Error("No productIds are valid"), null);
				}

				products = productsWithTotal?.products;
			}

			// Remove itens if they are falsy values (gRPC default values)
			for (let item in request) {
				if (!request[item]) {
					delete request[item];
				}
			}

			const updatedPharmacy = await this.pharmacyRepository.update(id, request);
			await this.pharmacyProductsRepository.deleteByPharmacyId(id);
			if (Array.isArray(call.request.productIds)) {
				await Promise.all(
					call.request.productIds.map((productId: string) =>
						this.pharmacyProductsRepository.save({
							productId,
							pharmacy: updatedPharmacy,
						})
					)
				);
			}

			return callback(null, {
				...updatedPharmacy,
				products,
				createdAt: updatedPharmacy?.createdAt?.toISOString() || "",
				updatedAt: updatedPharmacy?.updatedAt?.toISOString() || "",
			});
		} catch (error: any) {
			return callback(error, null);
		}
	}

	async deletePharmacy(
		call: Record<string, any>,
		callback: ICallback
	): Promise<void> {
		try {
			const { id } = call.request;

			const pharmacyFound = await this.pharmacyRepository.getById(id);

			if (!pharmacyFound) {
				return callback(new Error("Pharmacy not found!"), null);
			}

			await this.pharmacyRepository.delete(id);

			return callback(null, {});
		} catch (error: any) {
			return callback(error, null);
		}
	}

	async deleteProduct(
		call: Record<string, any>,
		callback: ICallback
	): Promise<void> {
		try {
			const { id } = call.request;

			await this.pharmacyProductsRepository.deleteByProductId(id);

			return callback(null, {});
		} catch (error: any) {
			console.log(error);
			return callback(error, null);
		}
	}
}
