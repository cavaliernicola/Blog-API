const supertest = require("supertest");
const app = require("../../app");
const request = supertest(app);
const User = require("../../models/user");
const db = require("../../db/database");
const { connectDB, deleteEverything } = require("../../db/manage");
const { StatusCodes } = require("http-status-codes");
const { ErrorMessages } = require("../../utils");

const userResult = {
	user: {
		user_id: expect.any(String),
		username: expect.any(String),
		age: expect.any(Number),
		city: expect.any(String),
	},
};

const baseUrl = "/api/v1/users";
const userPayload = {
	username: "nicola",
	age: 21,
	city: "venice",
};

let testUserId;

module.exports = () =>
	describe("testing user endpoints", () => {
		beforeAll(async () => {
			await connectDB();
			await deleteEverything();
			const result = await User.create(userPayload);
			testUserId = result.user_id;
		});

		test("get a single user by id", async () => {
			const result = await request
				.get(`${baseUrl}/${testUserId}`)
				.expect("Content-Type", /json/)
				.expect(StatusCodes.OK);

			expect(result.body).toEqual(expect.objectContaining(userResult));
		});

		test("create a new user with an invalid username", async () => {
			const result = await request
				.post(baseUrl)
				.send({
					username: "invalid__username",
					age: 18,
					city: "venice",
				})
				.expect("Content-Type", /json/)
				.expect(StatusCodes.BAD_REQUEST);
			expect(result.body.msg).toBe(ErrorMessages.invalidUsername);
		});

		test("create a new user with an already used username but different case", async () => {
			const result = await request
				.post(baseUrl)
				.send({
					...userPayload,
					username: userPayload.username.toUpperCase(),
				})
				.expect("Content-Type", /json/)
				.expect(StatusCodes.BAD_REQUEST);
			expect(result.body.msg).toContain(ErrorMessages.elementAlreadyTaken());
		});

		test("create a new user with a wrong city", async () => {
			const result = await request
				.post(baseUrl)
				.send({
					username: "unique_username",
					age: 18,
					city: "Not a city",
				})
				.expect("Content-Type", /json/)
				.expect(StatusCodes.BAD_REQUEST);
			expect(result.body.msg).toBe(ErrorMessages.invalidCity);
		});

		test("update an existing user with new values", async () => {
			const result = await request
				.patch(`${baseUrl}/${testUserId}`)
				.send({
					username: "new_username",
				})
				.expect("Content-Type", /json/)
				.expect(StatusCodes.OK);

			expect(result.body).toEqual(expect.objectContaining(userResult));
		});

		test("delete an existing user", async () => {
			await request
				.delete(`${baseUrl}/${testUserId}`)
				.expect(StatusCodes.NO_CONTENT);
		});

		test("delete a non existing user", async () => {
			const result = await request
				.delete(`${baseUrl}/randomId`)
				.expect("Content-Type", /json/)
				.expect(StatusCodes.NOT_FOUND);

			expect(result.body.msg).toBe(
				ErrorMessages.elementNotFound(User.tableName, "randomId")
			);
		});
	});
