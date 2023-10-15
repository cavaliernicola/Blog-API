const { StatusCodes } = require("http-status-codes");
const Interaction = require("../models/interaction");
const Post = require("../models/post");
const User = require("../models/user");
const { checkExistence, ErrorMessages } = require("../utils");
const { BadRequestError } = require("../errors");

const getInteraction = async (req, res) => {
	const { id } = req.params;
	const interaction = await Interaction.findOne({ interaction_id: id });

	checkExistence(interaction, id, Interaction.tableName);
	res.status(StatusCodes.OK).json({ interaction });
};

const createInteraction = async (req, res) => {
	const values = Interaction.validateUserInput(req.body);
	const { interaction_type, content, to_post, created_by } = values;

	// we need to check if those values have been provided because of manual .findOne check
	if (!(to_post && created_by)) {
		throw new BadRequestError(
			ErrorMessages.elementNotNull("to_post, created_by")
		);
	}

	// checking if the user/post exist is not necessary because the database has a foreign key contraints
	// that referes to users/posts table, we do it just as double security.
	const user = await User.findOne({ user_id: created_by });
	checkExistence(user, created_by, User.tableName);

	const post = await Post.findOne({ post_id: to_post });
	checkExistence(post, to_post, Post.tableName);

	// save the interaction if both post and user exist
	const interaction = await Interaction.create({
		interaction_type,
		content,
		to_post,
		created_by,
	});
	res.status(StatusCodes.CREATED).json({ interaction });
};

const deleteInteraction = async (req, res) => {
	const { id } = req.params;
	const interaction = await Interaction.delete({ interaction_id: id });

	checkExistence(interaction, id, Interaction.tableName);
	res.status(StatusCodes.NO_CONTENT).send();
};

const updateInteraction = async (req, res) => {
	const { id } = req.params;
	const values = Interaction.validateUserInput(req.body);
	const { interaction_type, content } = values;

	const interaction = await Interaction.update(
		{ interaction_id: id },
		{
			interaction_type,
			content,
		}
	);

	checkExistence(interaction, id, Interaction.tableName);
	res.status(StatusCodes.OK).json({ interaction });
};

module.exports = {
	getInteraction,
	createInteraction,
	deleteInteraction,
	updateInteraction,
};
