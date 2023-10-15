const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { SqliteError } = require("better-sqlite3");
const { DatabaseError } = require("pg");
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

	// we support error string for both development database and production one
	// prettier-ignore
	if (err instanceof SqliteError || err instanceof DatabaseError) {
        // we match the element that failed from the error string
        let element = err.column || (err.detail && err.detail.match(/\((.*?)\)/)[1]) || (err.message && err.message.match(/[^:\s]+$/)[0].split(".").pop()).replace(/"/g, "") || "value";

        switch (err.code) {
            case "SQLITE_CONSTRAINT_UNIQUE":
            case "23505":
                customError.msg = ErrorMessages.elementAlreadyTaken(element);
                customError.statusCode = StatusCodes.BAD_REQUEST;
                break;
            case "SQLITE_CONSTRAINT_NOTNULL":
            case "23502":
                customError.msg = ErrorMessages.elementNotNull(element);
                customError.statusCode = StatusCodes.BAD_REQUEST;
                break;
            case "SQLITE_CONSTRAINT_CHECK":
            case "23514":
                if (err.table === "interactions" || err.message.match(/interactions\.interaction_type.*interactions\.content/)) {
                    customError.msg = ErrorMessages.invalidInteractionContent;
                    customError.statusCode = StatusCodes.BAD_REQUEST;
                }
                break;
            case "22P02":
                customError.msg = ErrorMessages.elementNotFound(err.message.match(/"(.*?)"/).pop().replace(/"/g, ""), element);
                customError.statusCode = StatusCodes.NOT_FOUND;
                break;
        }
    }
	return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
