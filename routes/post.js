const express = require("express");
const {
	getAllPosts,
	createPost,
	updatePost,
	deletePost,
} = require("../controllers/post");
const router = express.Router();

router.route("/").get(getAllPosts).post(createPost);
router.route("/:id").patch(updatePost).delete(deletePost);

module.exports = router;
