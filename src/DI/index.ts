import { container } from "tsyringe";

import IPharmacyRepository from "../repositories/IPharmacyRepository";
import IPharmacyProductsRepository from "../repositories/IPharmacyProductsRepository";
import PharmacyRepository from "../repositories/PharmacyRepository";
import PharmacyProductsRepository from "../repositories/PharmacyProductsRepository";

container.registerSingleton<IPharmacyRepository>(
	"PharmacyRepository",
	PharmacyRepository
);

container.registerSingleton<IPharmacyProductsRepository>(
	"PharmacyProductsRepository",
	PharmacyProductsRepository
);
