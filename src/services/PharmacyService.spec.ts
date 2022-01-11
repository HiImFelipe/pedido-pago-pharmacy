import TestUtil from "../utils/testUtils";
import { PharmacyService } from "./PharmacyService";
import Pharmacy from "../entities/Pharmacy";
import { PharmacyIndexOptions } from "../../@types/QueryOptions";

describe("PharmacyService", () => {
	// The intention is not to test the repository functions, but to test the service,
	// so we can mock the repository functions and test the service.

	const mockRepository = {
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

	const service = new PharmacyService(mockRepository);

	beforeEach(() => {
		mockRepository.getById.mockReset();
		mockRepository.getAll.mockReset();
		mockRepository.getAllByName.mockReset();
		mockRepository.save.mockReset();
		mockRepository.index.mockReset();
		mockRepository.update.mockReset();
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("Find all pharmacies", () => {
		it("should list all pharmacies", async () => {
			const pharmacy = TestUtil.createAValidPharmacy();

			mockRepository.getAll.mockReturnValue(
				new Promise((resolve) =>
					resolve({ pharmacies: [pharmacy, pharmacy], totalPharmacies: 2 })
				)
			);

			await service.getAllPharmacies({}, (err, res) => {
				expect(err).toBeNull();
				expect(res.pharmacies).toHaveLength(2);
				expect(res.totalPharmacies).toBe(2);
				expect(res).toEqual({
					pharmacies: [pharmacy, pharmacy],
					totalPharmacies: 2,
				});
			});

			expect(mockRepository.getAll).toBeCalledTimes(1);
		});
	});

	describe("Find one pharmacy", () => {
		it("should get a single pharmacy's data", async () => {
			const pharmacy = TestUtil.createAValidPharmacy();

			mockRepository.getById.mockReturnValue(
				new Promise<Pharmacy>((resolve) => resolve(pharmacy))
			);
			await service.getPharmacy({ request: { id: 1 } }, (err, res) => {
				expect(err).toBeNull();
				expect(res).toEqual(pharmacy);
			});

			expect(mockRepository.getById).toBeCalledTimes(1);
		});

		it("should not get a single pharmacy's data (not found)", async () => {
			mockRepository.getById.mockReturnValue(
				new Promise<undefined>((resolve) => resolve(undefined))
			);
			await service.getPharmacy({ request: { id: 1 } }, (err, res) => {
				expect(err).toBeNull();
				expect(res).toHaveProperty("error", "Pharmacy not found!");
			});

			expect(mockRepository.getById).toBeCalledTimes(1);
		});
	});

	describe("Create an pharmacy", () => {
		it("should create a new pharmacy", async () => {
			const pharmacy = TestUtil.createAValidPharmacy();

			mockRepository.getAllByName.mockReturnValue(
				new Promise<Pharmacy[]>((resolve) => resolve([]))
			);
			mockRepository.save.mockReturnValue(
				new Promise((resolve) => resolve(pharmacy))
			);

			await service.createPharmacy({ request: { ...pharmacy } }, (err, res) => {
				expect(err).toBeNull();
				expect(res).toEqual(pharmacy);
				expect(res).toHaveProperty("isSubsidiary", false);
			});

			expect(mockRepository.getAllByName).toBeCalledTimes(1);
			expect(mockRepository.save).toBeCalledTimes(1);
		});

		it("should create a new subsidiary pharmacy", async () => {
			const pharmacy = TestUtil.createAValidPharmacy();

			mockRepository.getAllByName.mockReturnValue(
				new Promise<Pharmacy[]>((resolve) => resolve(Array(3).fill(pharmacy)))
			);
			mockRepository.save.mockReturnValue(
				new Promise((resolve) => resolve(pharmacy))
			);

			await service.createPharmacy({ request: { ...pharmacy } }, (err, res) => {
				expect(err).toBeNull();
				expect(res).toEqual({ ...pharmacy, isSubsidiary: true });
				expect(res).toHaveProperty("isSubsidiary", true);
			});

			expect(mockRepository.getAllByName).toBeCalledTimes(1);
			expect(mockRepository.save).toBeCalledTimes(1);
		});

		it("should not create a new pharmacy (exceeded maximum subsidiaries)", async () => {
			const pharmacy = TestUtil.createAValidPharmacy();

			mockRepository.getAllByName.mockReturnValue(
				new Promise((resolve) => resolve(Array(4).fill(pharmacy)))
			);
			mockRepository.save.mockReturnValue(
				new Promise((resolve) => resolve(pharmacy))
			);

			await service.createPharmacy({ request: { ...pharmacy } }, (err, res) => {
				expect(err).toBeDefined();
				expect(res).toHaveProperty("error", "Maximum subsidiaries reached");
			});

			expect(mockRepository.getAllByName).toBeCalledTimes(1);
			expect(mockRepository.save).toBeCalledTimes(0);
		});
	});

	describe("Delete an existing pharmacy", () => {
		it("should delete an pharmacy", async () => {
			const pharmacy = TestUtil.createAValidPharmacy();

			mockRepository.getById.mockReturnValue(
				new Promise<Pharmacy>((resolve) => resolve(pharmacy))
			);
			mockRepository.delete.mockReturnValue(
				new Promise((resolve) => resolve())
			);
			await service.deletePharmacy({ request: { id: 1 } }, (err, res) => {
				expect(err).toBeNull();
				expect(res).toStrictEqual({});
			});

			expect(mockRepository.delete).toBeCalledTimes(1);
			expect(mockRepository.getById).toBeCalledTimes(1);
		});

		it("should not delete an pharmacy (not found)", async () => {
			mockRepository.getById.mockReturnValue(
				new Promise<undefined>((resolve) => resolve(undefined))
			);
			mockRepository.delete.mockReturnValue(
				new Promise((resolve) => resolve())
			);
			await service.deletePharmacy({ request: { id: 1 } }, (err, res) => {
				expect(err).toBeNull();
				expect(res).toHaveProperty("error", "Pharmacy not found!");
			});

			expect(mockRepository.delete).toBeCalledTimes(0);
			expect(mockRepository.getById).toBeCalledTimes(1);
		});
	});

	describe("Update an existing pharmacy", () => {
		it("should update an pharmacy", async () => {
			const pharmacy = TestUtil.createAValidPharmacy();

			const dataToBeUpdated = { name: "Cleber" };

			mockRepository.getById.mockReturnValue(
				new Promise<Pharmacy>((resolve) => resolve(pharmacy))
			);
			mockRepository.update.mockReturnValue(
				new Promise((resolve) => resolve({ ...pharmacy, ...dataToBeUpdated }))
			);

			await service.updatePharmacy(
				{ request: { id: 1, ...dataToBeUpdated } },
				(err, res) => {
					expect(err).toBeNull();
					expect(res).toEqual({ ...pharmacy, ...dataToBeUpdated });
				}
			);

			expect(mockRepository.getById).toBeCalledTimes(1);
			expect(mockRepository.update).toBeCalledTimes(1);
		});

		it("should not update an pharmacy (pharmacy not found)", async () => {
			const dataToBeUpdated = { name: "Cleber" };

			mockRepository.getById.mockReturnValue(
				new Promise<undefined>((resolve) => resolve(undefined))
			);

			await service.updatePharmacy(
				{ request: { id: 1, ...dataToBeUpdated } },
				(err, res) => {
					expect(err).toBeNull();
					expect(res).toHaveProperty("error", "Pharmacy not found!");
				}
			);

			expect(mockRepository.getById).toBeCalledTimes(1);
			expect(mockRepository.update).toBeCalledTimes(0);
		});
	});
});
