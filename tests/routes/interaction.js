const supertest = require("supertest");
const app = require("../../app");
const request = supertest(app);
const Interaction = require("../../models/interaction");
const User = require("../../models/user");
const Post = require("../../models/post");
const { connectDB, deleteEverything } = require("../../db/manage");
const { StatusCodes } = require("http-status-codes");
const { ErrorMessages } = require("../../utils");
require("jest-extended");
require("../utils/custom-validators");

const interactionResult = {
	interaction: {
		interaction_id: expect.any(String),
		created_at: expect.any(String),
		interaction_type: expect.stringMatching(/like|comment/),
		content: expect.nullOrString(),
		to_post: expect.any(String),
		created_by: expect.any(String),
	},
};

const baseUrl = "/api/v1/interactions";
const postPayload = {
	title:
		"NASA Sets Coverage of Spacewalks, News Conference for Station Upgrades",
};

const userPayload = {
	username: "user",
	age: 21,
	city: "venice",
};

let testUserId;
let testPostId;
let testInteractionId;

module.exports = () =>
	describe("testing interaction endpoints", () => {
		beforeAll(async () => {
			await connectDB();
			// delete all interactions before testing
			await deleteEverything();
			const postResult = await Post.create(postPayload);
			const userResult = await User.create(userPayload);
			testPostId = postResult.post_id;
			testUserId = userResult.user_id;

			const interactionResult = await Interaction.create({
				interaction_type: "like",
				created_by: testUserId,
				to_post: testPostId,
			});
			testInteractionId = interactionResult.interaction_id;
		});

		test("create a new interaction", async () => {
			const result = await request
				.post(baseUrl)
				.send({
					interaction_type: "comment",
					content: "Interesting news!",
					created_by: testUserId,
					to_post: testPostId,
				})
				.expect("Content-Type", /json/)
				.expect(StatusCodes.CREATED);
			expect(result.body).toEqual(expect.objectContaining(interactionResult));
		});

		test("get a single interaction", async () => {
			const result = await request
				.get(`${baseUrl}/${testInteractionId}`)
				.expect("Content-Type", /json/)
				.expect(StatusCodes.OK);
			expect(result.body).toEqual(expect.objectContaining(interactionResult));
		});

		test("update an existing interaction with invalid new values", async () => {
			const result = await request
				.patch(`${baseUrl}/${testInteractionId}`)
				.send({
					interaction_type: "comment",
				})
				.expect("Content-Type", /json/)
				.expect(StatusCodes.BAD_REQUEST);

			expect(result.body.msg).toBe(ErrorMessages.invalidInteractionContent);
		});
	});
