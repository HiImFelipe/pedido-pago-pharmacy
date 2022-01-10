import {
	loadPackageDefinition,
	Server,
	ServerCredentials,
} from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import { createConnection } from "typeorm";
import path from "path";

import "./src/DI";

createConnection().catch((e) => console.log(e));

const packageDefinition = loadSync(
	path.resolve(__dirname, "src", "pb", "pharmacy.proto"),
	{
		keepCase: true,
		longs: String,
		enums: String,
		defaults: true,
		oneofs: true,
	}
);

// Reason why "any" type was used: https://github.com/grpc/grpc-node/issues/1353#issuecomment-612977724
const pharmacyProto: any =
	loadPackageDefinition(packageDefinition).pharmacyservice;

const server = new Server();
server.addService(pharmacyProto.PharmacyService.service, {});
server.bindAsync(
	"localhost:50051",
	ServerCredentials.createInsecure(),
	(err, port) => {
		if (err) {
			console.error(err);
			return;
		}

		server.start();
		console.log(`server running on port: ${port}`);
	}
);
