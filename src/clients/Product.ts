import load from "../pb/loader";

export const ProductClient = load({
	serviceName: "ProductService",
	address: "localhost:50052",
	fileName: "product",
});
