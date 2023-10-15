const moment = require("moment/moment");
const { BadRequestError, NotFoundError } = require("../errors");
const ErrorMessages = require("./error-messages");

const checkExistence = (element, id, typeName) => {
	if (!element) {
		throw new NotFoundError(ErrorMessages.elementNotFound(typeName, id));
	}
};

const makePostObject = (rows) => {
	const posts = {};
	rows.forEach((row) => {
		const postId = row.post_id;
		let interaction;
		if (row.interaction_type !== null) {
			interaction = {
				interaction_type: row.interaction_type,
				content: row.content,
				created_at: row.i_created_at,
				city: row.city,
			};
		}

		if (!posts[postId]) {
			posts[postId] = {
				post_id: postId,
				created_at: row.created_at,
				title: row.title,
				interactions: interaction ? [interaction] : [],
			};
		} else {
			posts[postId].interactions.push(interaction);
		}
	});
	return Object.values(posts);
};

const validateDate = (dates) => {
	const result = [];
	for (let date of dates) {
		// we allow the date to be null for checks like ",date" where only the second value is provided
		// so the result must be lower than that only (no need to specify from where it starts)
		if (date) {
			const isValid = moment(date, "DD/MM/YYYY").isValid();
			if (!isValid) throw new BadRequestError(ErrorMessages.invalidDateFormat);
			result.push(moment(date, "DD/MM/YYYY").format("YYYY-MM-DD HH:mm:ss"));
		} else result.push(date);
	}
	return result;
};

const handleQueryDate = (search, rowName, dateObj) => {
	let [startDate, endDate] = validateDate(dateObj.split(","));
	// if the user inserted the same value for both startDate and endDate, we take all the result of that specific day
	// since the check starts from 00:00:00 of each day, our check would be if (day >= day and day <= day)
	// which would produce no result, therefore we need to add 1 day to make it working properly.
	if (startDate === endDate) {
		endDate = moment(endDate, "YYYY-MM-DD HH:mm:ss")
			.add(1, "d")
			.subtract(1, "s")
			.format("YYYY-MM-DD HH:mm:ss");
	}

	if (startDate) {
		search.andWhere(rowName, ">=", startDate);
	}

	if (endDate) {
		search.andWhere(rowName, "<=", endDate);
	}
};

module.exports = {
	checkExistence,
	makePostObject,
	validateDate,
	handleQueryDate,
};
