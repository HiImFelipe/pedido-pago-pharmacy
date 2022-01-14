import Pharmacy from "../entities/Pharmacy";
import PharmacyProducts from "../entities/PharmacyProducts";

export default class TestUtil {
	static createAValidPharmacy(data?: Partial<Pharmacy>): Pharmacy {
		const pharmacy = new Pharmacy();
		pharmacy.name = data?.name || "Test Pharmacy";
		pharmacy.address = data?.address || "Test Address";
		pharmacy.phone = data?.phone || "(11)99234-6789";
		pharmacy.cep = data?.cep || "12345678";
		pharmacy.logo = data?.logo || "example/path/to/logo.png";
		pharmacy.openingTime = data?.openingTime || "8:30";
		pharmacy.closingTime = data?.closingTime || "17:50";
		pharmacy.uf = data?.uf || "SP";
		pharmacy.createdAt = data?.createdAt || new Date();
		pharmacy.updatedAt = data?.updatedAt || new Date();
		pharmacy.responsibleName = data?.address || "Test User";
		pharmacy.isSubsidiary = data?.isSubsidiary || false;

		const pharmacyProducts = new PharmacyProducts();
		pharmacyProducts.pharmacy = pharmacy;
		pharmacyProducts.productId = "123456789";

		pharmacy.products = [pharmacyProducts];
		return pharmacy;
	}
}
