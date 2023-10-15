const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const { checkExistence } = require("../utils");

const createUser = async (req, res) => {
	const values = User.validateUserInput(req.body);
	const { username, city, age } = values;
	const user = await User.create({ username, city, age });
	res.status(StatusCodes.CREATED).json({ user });
};

const getUser = async (req, res) => {
	const { id } = req.params;
	const user = await User.findOne({ user_id: id });

	checkExistence(user, id, User.tableName);
	res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req, res) => {
	const { id } = req.params;
	const { username, city, age } = User.validateUserInput(req.body);
	const user = await User.update({ user_id: id }, { username, city, age });

	checkExistence(user, id, User.tableName);
	res.status(StatusCodes.OK).json({ user });
};

const deleteUser = async (req, res) => {
	const { id } = req.params;
	const user = await User.delete({ user_id: id });

	checkExistence(user, id, User.tableName);
	res.status(StatusCodes.NO_CONTENT).send();
};

module.exports = {
	createUser,
	getUser,
	updateUser,
	deleteUser,
};
