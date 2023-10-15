const Model = require("./model");
const database = require("../db/database");
const { BadRequestError } = require("../errors");
const { ErrorMessages } = require("../utils");

class User extends Model {
	constructor(tableName) {
		super(tableName);
	}

	initialStatement(table) {
		table.increments("id").notNullable().primary();
		table
			.uuid("interaction_id")
			.notNullable()
			.defaultTo(database.fn.uuid())
			.index();
		table.enu("interaction_type", ["like", "comment"]).notNullable();
		table.text("content").checkLength(">=", 1);
		table.uuid("to_post").notNullable();
		table.uuid("created_by").notNullable();
		table.datetime("created_at").defaultTo(database.fn.now());

		// constraints
		table.foreign("to_post").references("posts.post_id").onDelete("CASCADE");
		table.foreign("created_by").references("users.user_id").onDelete("CASCADE");

		table.check(
			"(interactions.interaction_type = 'like' AND interactions.content IS NULL) OR (interactions.interaction_type = 'comment' AND interactions.content IS NOT NULL)"
		);
	}

	validateUserInput(input) {
		const { interaction_type, content } = input;
		if (interaction_type !== undefined) {
			if (!["comment", "like"].includes(interaction_type)) {
				throw new BadRequestError(ErrorMessages.invalidInteraction);
			}

			// just make sure there is no content for likes
			if (interaction_type === "like") {
				input.content = null;
			}
		}

		if (content !== undefined && content !== null) {
			input.content = input.content.trim();
			if (input.content.length < 1) {
				throw new BadRequestError(ErrorMessages.emptyInteractionContent);
			}
		}
		return input;
	}
}

module.exports = new User("interactions");
