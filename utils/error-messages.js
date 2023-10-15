class ErrorMessages {
	static generalError = "Something went wrong, try again";
	static invalidInteraction = "The interaction_type must be in [like, comment]";
	static emptyInteractionContent = "Content can't be empty.";
	static postTitleTooShort = "The title must be longer than 2 characters";
	static usernameTooShort = "The username must have at least 5 characters";
	static usernameTooLong = "The username must not exceed 30 characters";
	static invalidUsername =
		"The username pattern allow a username to start only with letters and have a maximum of two underscores (_) consecutively.";
	static invalidCity =
		"The city is not recognized, make sure it's correctly written in English.";
	static negativeAge = "The age can't be negative.";
	static invalidInteractionContent =
		'content can\'be null when interaction_type is set to "comment" and must be null when interaction_type is set to "like"';

	static invalidDateFormat = "Date must be in the format: DD/MM/YYYY";

	static elementAlreadyTaken(element = "") {
		return `${element} is already taken, choose another one.`;
	}

	static elementNotNull(element = "") {
		return `${element} can't be null, please provide one.`;
	}

	static elementNotFound(element = "", id = "") {
		return `No ${element} with id: ${id}`;
	}
}

module.exports = ErrorMessages;
