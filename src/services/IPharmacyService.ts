import { ICallback } from "../../@types/Proto";

export interface IPharmacyService {
	getPharmacy(call: Record<string, any>, callback: ICallback): Promise<void>;
	getAllPharmacies(
		call: Record<string, any>,
		callback: ICallback
	): Promise<void>;
	createPharmacy(call: Record<string, any>, callback: ICallback): Promise<void>;
	updatePharmacy(call: Record<string, any>, callback: ICallback): Promise<void>;
	deletePharmacy(call: Record<string, any>, callback: ICallback): Promise<void>;
}
