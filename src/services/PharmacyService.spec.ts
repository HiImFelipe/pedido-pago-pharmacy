import TestUtil from "../utils/testUtils";
import { PharmacyService } from "./PharmacyService";
import Pharmacy from "../entities/Pharmacy";
import { PharmacyIndexOptions } from "../../@types/QueryOptions";
import PharmacyProducts from "../entities/PharmacyProducts";

describe("PharmacyService", () => {
	// The intention is not to test the repository functions, but to test the service,
	// so we can mock the repository functions and test the service.

	const mockPharmaciesRepository = {
		getById: jest.fn<Promise<Pharmacy> | Promise<undefined>, [id: string]>(),
		getAll: jest.fn<
			Promise<{ pharmacies: Pharmacy[]; totalPharmacies: number }>,
			[query?: PharmacyIndexOptions]
		>(),
		getAllByName: jest.fn<Promise<Pharmacy[]>, [name: string]>(),
		save: jest.fn<Promise<Pharmacy>, [pharmacy: Pharmacy]>(),
		index: jest.fn<
			Promise<{ data: Pharmacy[]; count: number }>,
			[query?: PharmacyIndexOptions]
		>(),
		create: jest.fn<Promise<Pharmacy>, [pharmacy: Pharmacy]>(),
		update: jest.fn<
			Promise<Pharmacy>,
			[id: string, pharmacy: Omit<Pharmacy, "id">]
		>(),
		delete: jest.fn<Promise<void>, [id: string]>(),
	};

	const mockPharmacyProductsRepository = {
		getById: jest.fn<
			Promise<PharmacyProducts> | Promise<undefined>,
			[id: number]
		>(),
		getAll: jest.fn<
			Promise<{ pharmacies: PharmacyProducts[]; totalPharmacies: number }>,
			[query?: PharmacyIndexOptions]
		>(),
		save: jest.fn<Promise<PharmacyProducts>, [pharmacy: PharmacyProducts]>(),
		index: jest.fn<
			Promise<{ data: PharmacyProducts[]; count: number }>,
			[query?: PharmacyIndexOptions]
		>(),
		create: jest.fn<Promise<PharmacyProducts>, [pharmacy: PharmacyProducts]>(),
		update: jest.fn<
			Promise<PharmacyProducts>,
			[id: number, pharmacy: Omit<PharmacyProducts, "id">]
		>(),
		delete: jest.fn<Promise<void>, [id: number]>(),
		deleteByPharmacyId: jest.fn<Promise<void>, [pharmacyId: string]>(),
		deleteByProductId: jest.fn<Promise<void>, [productId: string]>(),
	};

	const service = new PharmacyService(
		mockPharmaciesRepository,
		mockPharmacyProductsRepository
	);

	beforeEach(() => {
		mockPharmaciesRepository.getById.mockReset();
		mockPharmaciesRepository.getAll.mockReset();
		mockPharmaciesRepository.getAllByName.mockReset();
		mockPharmaciesRepository.save.mockReset();
		mockPharmaciesRepository.index.mockReset();
		mockPharmaciesRepository.update.mockReset();
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("Find all pharmacies", () => {
		it("should list all pharmacies", async () => {
			const pharmacy = TestUtil.createAValidPharmacy();

			mockPharmaciesRepository.getAll.mockReturnValue(
				new Promise((resolve) =>
					resolve({ pharmacies: Array(2).fill(pharmacy), totalPharmacies: 2 })
				)
			);

			const parsedPharmacy = {
				...pharmacy,
				createdAt: pharmacy.createdAt.toISOString(),
				updatedAt: pharmacy.updatedAt.toISOString(),
			};

			await service.getAllPharmacies({}, (err, res) => {
				expect(err).toBeNull();
				expect(res.pharmacies).toHaveLength(2);
				expect(res.totalPharmacies).toBe(2);
				expect(res).toEqual({
					pharmacies: Array(2).fill(parsedPharmacy),
					totalPharmacies: 2,
				});
			});

			expect(mockPharmaciesRepository.getAll).toBeCalledTimes(1);
		});
	});

	describe("Find one pharmacy", () => {
		it("should get a single pharmacy's data", async () => {
			const pharmacy = TestUtil.createAValidPharmacy();

			mockPharmaciesRepository.getById.mockReturnValue(
				new Promise<Pharmacy>((resolve) => resolve(pharmacy))
			);
			await service.getPharmacy({ request: { id: 1 } }, (err, res) => {
				expect(err).toBeNull();
				expect(res).toEqual({
					...pharmacy,
					products: [],
					createdAt: pharmacy.createdAt.toISOString(),
					updatedAt: pharmacy.updatedAt.toISOString(),
				});
			});

			expect(mockPharmaciesRepository.getById).toBeCalledTimes(1);
		});

		it("should not get a single pharmacy's data (not found)", async () => {
			mockPharmaciesRepository.getById.mockReturnValue(
				new Promise<undefined>((resolve) => resolve(undefined))
			);
			await service.getPharmacy({ request: { id: 1 } }, (err, res) => {
				expect(err).toHaveProperty("message", "Pharmacy not found!");
				expect(res).toBeNull();
			});

			expect(mockPharmaciesRepository.getById).toBeCalledTimes(1);
		});
	});

	describe("Create a pharmacy", () => {
		it("should create a new pharmacy", async () => {
			const pharmacy = TestUtil.createAValidPharmacy();

			mockPharmaciesRepository.getAllByName.mockReturnValue(
				new Promise<Pharmacy[]>((resolve) => resolve([]))
			);
			mockPharmaciesRepository.save.mockReturnValue(
				new Promise((resolve) => resolve(pharmacy))
			);

			await service.createPharmacy({ request: { ...pharmacy } }, (err, res) => {
				expect(err).toBeNull();
				expect(res).toEqual({
					...pharmacy,
					products: [],
					createdAt: pharmacy.createdAt.toISOString(),
					updatedAt: pharmacy.updatedAt.toISOString(),
				});
				expect(res).toHaveProperty("isSubsidiary", false);
			});

			expect(mockPharmaciesRepository.getAllByName).toBeCalledTimes(1);
			expect(mockPharmaciesRepository.save).toBeCalledTimes(1);
		});

		it("should create a new subsidiary pharmacy", async () => {
			const pharmacy = TestUtil.createAValidPharmacy();

			mockPharmaciesRepository.getAllByName.mockReturnValue(
				new Promise<Pharmacy[]>((resolve) => resolve(Array(3).fill(pharmacy)))
			);
			mockPharmaciesRepository.save.mockReturnValue(
				new Promise((resolve) => resolve(pharmacy))
			);

			await service.createPharmacy({ request: { ...pharmacy } }, (err, res) => {
				expect(err).toBeNull();
				expect(res).toEqual({
					...pharmacy,
					products: [],
					createdAt: pharmacy.createdAt.toISOString(),
					updatedAt: pharmacy.updatedAt.toISOString(),
					isSubsidiary: true,
				});
				expect(res).toHaveProperty("isSubsidiary", true);
			});

			expect(mockPharmaciesRepository.getAllByName).toBeCalledTimes(1);
			expect(mockPharmaciesRepository.save).toBeCalledTimes(1);
		});

		it("should not create a new pharmacy (exceeded maximum subsidiaries)", async () => {
			const pharmacy = TestUtil.createAValidPharmacy();

			mockPharmaciesRepository.getAllByName.mockReturnValue(
				new Promise((resolve) => resolve(Array(4).fill(pharmacy)))
			);
			mockPharmaciesRepository.save.mockReturnValue(
				new Promise((resolve) => resolve(pharmacy))
			);

			await service.createPharmacy({ request: { ...pharmacy } }, (err, res) => {
				expect(err).toBeDefined();
				expect(err).toHaveProperty("message", "Maximum subsidiaries reached");
				expect(res).toBeNull();
			});

			expect(mockPharmaciesRepository.getAllByName).toBeCalledTimes(1);
			expect(mockPharmaciesRepository.save).toBeCalledTimes(0);
		});
	});

	describe("Delete an existing pharmacy", () => {
		it("should delete a pharmacy", async () => {
			const pharmacy = TestUtil.createAValidPharmacy();

			mockPharmaciesRepository.getById.mockReturnValue(
				new Promise<Pharmacy>((resolve) => resolve(pharmacy))
			);
			mockPharmaciesRepository.delete.mockReturnValue(
				new Promise((resolve) => resolve())
			);
			await service.deletePharmacy({ request: { id: 1 } }, (err, res) => {
				expect(err).toBeNull();
				expect(res).toStrictEqual({});
			});

			expect(mockPharmaciesRepository.delete).toBeCalledTimes(1);
			expect(mockPharmaciesRepository.getById).toBeCalledTimes(1);
		});

		it("should not delete a pharmacy (not found)", async () => {
			mockPharmaciesRepository.getById.mockReturnValue(
				new Promise<undefined>((resolve) => resolve(undefined))
			);
			mockPharmaciesRepository.delete.mockReturnValue(
				new Promise((resolve) => resolve())
			);
			await service.deletePharmacy({ request: { id: 1 } }, (err, res) => {
				expect(err).toHaveProperty("message", "Pharmacy not found!");
				expect(res).toBeNull();
			});

			expect(mockPharmaciesRepository.delete).toBeCalledTimes(0);
			expect(mockPharmaciesRepository.getById).toBeCalledTimes(1);
		});
	});

	describe("Update an existing pharmacy", () => {
		it("should update a pharmacy", async () => {
			const pharmacy = TestUtil.createAValidPharmacy();

			const dataToBeUpdated: Partial<Pharmacy> = { name: "Cleber" };

			mockPharmaciesRepository.getById.mockReturnValue(
				new Promise<Pharmacy>((resolve) => resolve(pharmacy))
			);
			mockPharmaciesRepository.update.mockReturnValue(
				new Promise((resolve) => resolve({ ...pharmacy, ...dataToBeUpdated }))
			);
			// mockPharmacyProductsRepository.getAllByPharmacyId.mockReturnValue(
			// 	new Promise<PharmacyProducts[]>((resolve) => resolve([]))
			// );

			console.log(pharmacy);

			await service.updatePharmacy(
				{ request: { id: 1, ...dataToBeUpdated } },
				(err, res) => {
					expect(err).toBeNull();
					expect(res).toEqual({
						...pharmacy,
						...dataToBeUpdated,
						createdAt: dataToBeUpdated.createdAt
							? dataToBeUpdated.createdAt.toISOString()
							: pharmacy.createdAt.toISOString(),
						updatedAt: dataToBeUpdated.updatedAt
							? dataToBeUpdated.updatedAt.toISOString()
							: pharmacy.updatedAt.toISOString(),
					});
				}
			);

			expect(mockPharmaciesRepository.getById).toBeCalledTimes(1);
			expect(mockPharmaciesRepository.update).toBeCalledTimes(1);
		});

		it("should not update a pharmacy (pharmacy not found)", async () => {
			const dataToBeUpdated = { name: "Cleber" };

			mockPharmaciesRepository.getById.mockReturnValue(
				new Promise<undefined>((resolve) => resolve(undefined))
			);

			await service.updatePharmacy(
				{ request: { id: 1, ...dataToBeUpdated } },
				(err, res) => {
					expect(err).toHaveProperty("message", "Pharmacy not found!");
					expect(res).toBeNull();
				}
			);

			expect(mockPharmaciesRepository.getById).toBeCalledTimes(1);
			expect(mockPharmaciesRepository.update).toBeCalledTimes(0);
		});
	});
});
