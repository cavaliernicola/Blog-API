const userRoute = require("./user");
const postRoute = require("./post");
const interactionRoute = require("./interaction");
const db = require("../../db/database");

describe("sequentially testing routes", () => {
	userRoute();
	postRoute();
	interactionRoute();

	afterAll(async () => {
		await db.destroy();
	});
});
