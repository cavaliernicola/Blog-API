const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { ErrorMessages } = require("../utils");

const errorHandlerMiddleware = (err, req, res, next) => {
	let customError = {
		statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
		msg: ErrorMessages.generalError,
	};

	if (err instanceof CustomAPIError) {
		customError.msg = err.message;
		customError.statusCode = err.statusCode;
	}

	let element;
	switch (err.code) {
		case "ER_NO_DEFAULT_FOR_FIELD":
			element = err.sqlMessage.match(/'(\w+)'/)[1];
			customError.msg = ErrorMessages.elementNotNull(element);
			customError.statusCode = StatusCodes.BAD_REQUEST;
			break;
		case "ER_DUP_ENTRY":
			element = err.sqlMessage.match(/_(\w+)_unique/)[1];
			customError.msg = ErrorMessages.elementAlreadyTaken(element);
			customError.statusCode = StatusCodes.BAD_REQUEST;
			break;
		case "ER_CHECK_CONSTRAINT_VIOLATED":
			if (err.sqlMessage.match(/interactions_chk_/)) {
				customError.msg = ErrorMessages.invalidInteractionContent;
				customError.statusCode = StatusCodes.BAD_REQUEST;
			}
			break;
	}
	return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
