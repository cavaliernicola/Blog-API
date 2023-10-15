const supertest = require("supertest");
const app = require("../../app");
const request = supertest(app);
const Post = require("../../models/post");
const User = require("../../models/user");
const Interaction = require("../../models/interaction");
const { connectDB, deleteEverything } = require("../../db/manage");
const { StatusCodes } = require("http-status-codes");
const { ErrorMessages } = require("../../utils");
const moment = require("moment");
require("../utils/custom-validators");

const postResult = {
	post: {
		created_at: expect.any(String),
		post_id: expect.any(String),
		title: expect.any(String),
	},
};

const baseUrl = "/api/v1/posts";
const postPayload = {
	title:
		"NASA Sets Coverage of Spacewalks, News Conference for Station Upgrades",
};

let testPostId;

module.exports = () =>
	describe("testing post endpoints", () => {
		beforeAll(async () => {
			await connectDB();
			await deleteEverything();
			const result = await Post.create(postPayload);
			testPostId = result.post_id;
		});

		test("get all posts", async () => {
			const result = await request
				.get(baseUrl)
				.expect("Content-Type", /json/)
				.expect(StatusCodes.OK);

			const expectedResult = {
				posts: expect.arrayContaining([
					{
						post_id: expect.any(String),
						title: expect.any(String),
						created_at: expect.any(String),
						interactions: expect.any(Array),
					},
				]),
			};

			expect(result.body).toEqual(expectedResult);
		});

		test("get all posts with query filter for interactions", async () => {
			const cities = ["venice", "bologna"];
			const dates = ["08/10/2023", "07/10/2023", "10/10/2020"];

			// Populate with some dummy content
			for (let i = 0; i < 2; i++) {
				for (let city of cities) {
					let user = await User.create({
						username: `username${i}_${city}`,
						age: 18,
						city,
					});
					for (let date of dates) {
						let post = await Post.create({
							title: "random post",
						});
						await Interaction.create({
							created_at: moment(date, "DD/MM/YYYY").format(
								"YYYY-MM-DD HH:mm:ss"
							),
							to_post: post.post_id,
							created_by: user.user_id,
							interaction_type: "like",
						});
					}
				}
			}
			const result = await request
				.get(
					`${baseUrl}?interactionCity=venice&interactionDate=07/10/2023,07/10/2023`
				)
				.expect("Content-Type", /json/)
				.expect(StatusCodes.OK);

			const expectedResult = {
				posts: expect.arrayContaining([
					{
						post_id: expect.any(String),
						title: expect.any(String),
						created_at: expect.any(String),
						interactions: expect.arrayContaining([
							{
								interaction_type: expect.any(String),
								created_at: expect.stringMatching(
									moment("07/10/2023", "DD/MM/YYYY").format("YYYY-MM-DD")
								),
								city: "venice",
								content: expect.nullOrString(),
							},
						]),
					},
				]),
			};

			expect(result.body).toEqual(expectedResult);
		}, 10000);

		test("create a new post with an invalid title", async () => {
			const result = await request
				.post(baseUrl)
				.send({
					title: "",
				})
				.expect("Content-Type", /json/)
				.expect(StatusCodes.BAD_REQUEST);

			expect(result.body.msg).toBe(ErrorMessages.postTitleTooShort);
		});

		test("update an existing post with new valid values", async () => {
			const result = await request
				.patch(`${baseUrl}/${testPostId}`)
				.send({
					title: "new_title",
				})
				.expect("Content-Type", /json/)
				.expect(StatusCodes.OK);

			expect(result.body).toEqual(expect.objectContaining(postResult));
		});

		test("delete an existing post", async () => {
			await request
				.delete(`${baseUrl}/${testPostId}`)
				.expect(StatusCodes.NO_CONTENT);
		});
	});
