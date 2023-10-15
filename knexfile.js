require("dotenv").config();

const development = {
	client: "better-sqlite3",
	connection: {
		filename: "./db/dev.sqlite3",
	},
	useNullAsDefault: true,
};

const production = {
	client: "pg",
	connection: {
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
	},
};

const test = {
	// ...production,
	...development,
	connection: {
		filename: ":memory:",
	},
};

module.exports = {
	production,
	development,
	test,
};
