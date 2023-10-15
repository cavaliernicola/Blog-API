const express = require("express");
const {
	getInteraction,
	createInteraction,
	deleteInteraction,
	updateInteraction,
} = require("../controllers/interaction");
const router = express.Router();

router.route("/").post(createInteraction);
router
	.route("/:id")
	.patch(updateInteraction)
	.delete(deleteInteraction)
	.get(getInteraction);

module.exports = router;
