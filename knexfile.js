require("dotenv").config();

const production = {
	client: "mysql2",
	connection: {
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		timezone: "Z",
	},
};

const development = {
	...production,
	connection: {
		...production.connection,
		database: process.env.DEV_DB_NAME,
	},
};

const test = {
	...production,
	connection: {
		...production.connection,
		database: process.env.TEST_DB_NAME,
	},
};

module.exports = {
	production,
	development,
	test,
};
