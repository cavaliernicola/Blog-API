const Model = require("./model");
const database = require("../db/database");
const { BadRequestError } = require("../errors");
const { ErrorMessages, handleQueryDate } = require("../utils");

class Post extends Model {
	constructor(tableName) {
		super(tableName);
	}

	initialStatement(table) {
		table.increments("id").notNullable().primary();
		table.uuid("post_id").notNullable().defaultTo(database.fn.uuid()).index();
		table.text("title").notNullable().checkLength(">=", 2);
		table.datetime("created_at").defaultTo(database.fn.now());
	}

	findPostsByFilter(queryObj) {
		const { postDate, interactionDate, interactionCity } = queryObj;
		const mainQuery = database(this.tableName).select(
			"posts.post_id",
			"posts.title",
			"posts.created_at",
			"i.interaction_type",
			"i.i_created_at",
			"i.content",
			"u.username",
			"u.age",
			"u.city"
		);

		// query to select the desired interactions columns to be used later to filter results based on interactionCity / interactionDate
		const interactionQuery = database
			.select(
				"interactions.interaction_type",
				"interactions.content",
				"interactions.created_at as i_created_at",
				"interactions.created_by",
				"interactions.to_post"
			)
			.from("interactions");

		// select only interactions that belongs to users with a certain city
		if (interactionCity) {
			const userQuery = database
				.select("user_id")
				.from("users")
				.where("city", "like", interactionCity);
			interactionQuery.whereIn("interactions.created_by", userQuery);
		}

		// select only interactions in a certain range of time
		if (interactionDate) {
			handleQueryDate(
				interactionQuery,
				"interactions.created_at",
				interactionDate
			);
		}

		// change the column name to make it easy for later queries
		interactionQuery.as("i");

		// get the complete results with the aggregate of interactions and users
		// and apply the interactions filters from interactionQuery
		mainQuery
			.leftJoin(interactionQuery, "i.to_post", "=", "post_id")
			.leftJoin("users as u", "u.user_id", "=", "i.created_by");

		// filter the results by the date of the posts
		if (postDate) {
			handleQueryDate(mainQuery, "posts.created_at", postDate);
		}

		return mainQuery;
	}

	validateUserInput(input) {
		const { title } = input;

		if (title !== undefined) {
			input.title = title.trim();
			if (input.title === "" || input.title.length < 2) {
				throw new BadRequestError(ErrorMessages.postTitleTooShort);
			}
		}

		return input;
	}
}

module.exports = new Post("posts");
