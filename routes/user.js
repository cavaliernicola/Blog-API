const express = require("express");
const {
	createUser,
	getUser,
	updateUser,
	deleteUser,
} = require("../controllers/user");
const router = express.Router();

router.route("/").post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
