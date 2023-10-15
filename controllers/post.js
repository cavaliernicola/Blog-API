const Post = require("../models/post");
const { checkExistence, makePostObject } = require("../utils");
const { StatusCodes } = require("http-status-codes");

const getAllPosts = async (req, res) => {
	const search = Post.findPostsByFilter(req.query);

	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const offset = Number(page - 1) * limit;

	search.offset(offset);
	search.limit(limit);

	const rows = await search;
	const posts = makePostObject(rows);
	res.status(StatusCodes.OK).json({ posts });
};

const createPost = async (req, res) => {
	const { title } = Post.validateUserInput(req.body);
	const post = await Post.create({ title });
	res.status(StatusCodes.CREATED).json({ post });
};

const updatePost = async (req, res) => {
	const { id } = req.params;
	const { title } = Post.validateUserInput(req.body);
	const post = await Post.update({ post_id: id }, { title });

	checkExistence(post, id, Post.tableName);
	res.status(StatusCodes.OK).json({ post });
};

const deletePost = async (req, res) => {
	const { id } = req.params;
	const post = await Post.delete({ post_id: id });

	checkExistence(post, id, Post.tableName);
	res.status(StatusCodes.NO_CONTENT).send();
};

module.exports = {
	getAllPosts,
	createPost,
	updatePost,
	deletePost,
};
