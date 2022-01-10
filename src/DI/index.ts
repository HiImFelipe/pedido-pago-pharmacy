import { container } from "tsyringe";

import IPharmacyRepository from "../repositories/IPharmacyRepository";
import PharmacyRepository from "../repositories/PharmacyRepository";

container.registerSingleton<IPharmacyRepository>(
	"PharmacyRepository",
	PharmacyRepository
);
