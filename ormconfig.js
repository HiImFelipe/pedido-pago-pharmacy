require("dotenv").config();

const srcConfig = {
	type: "mysql",
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	entities: ["./src/entities/*.ts"],
};

module.exports = srcConfig;
