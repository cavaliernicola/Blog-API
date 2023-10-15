const Model = require("./model");
const database = require("../db/database");
const { BadRequestError } = require("../errors");

// An alternative to check if the city exists would be this library: https://github.com/kinotto/geonames.js/, but a login is required to GeoNames platform.
const WorldCities = require("worldcities");
const { ErrorMessages } = require("../utils");

class User extends Model {
	constructor(tableName) {
		super(tableName);
	}

	initialStatement(table) {
		table.uuid("user_id").notNullable().primary().defaultTo(database.fn.uuid());
		table.string("username", 30).unique().notNullable();
		table.integer("age").notNullable();
		table.string("city", 60).notNullable();
	}

	validateUserInput(input) {
		const { username, city, age } = input;
		if (username !== undefined) {
			input.username = username.toLowerCase().trim();

			if (input.username === "" || input.username.length <= 5) {
				throw new BadRequestError(ErrorMessages.usernameTooShort);
			}

			if (input.username.length > 30) {
				throw new BadRequestError(ErrorMessages.usernameTooLong);
			}

			if (!input.username.match(/^[a-z][a-z0-9]*([_]{1}[a-z0-9]+)?[_]?$/i)) {
				throw new BadRequestError(ErrorMessages.invalidUsername);
			}
		}

		if (city !== undefined) {
			input.city = city.toLowerCase().trim();
			const myCity = WorldCities.getByName(input.city);
			if (!myCity || myCity.name.toLowerCase() !== input.city) {
				throw new BadRequestError(ErrorMessages.invalidCity);
			}
		}

		if (age !== undefined && age < 0) {
			throw new BadRequestError(ErrorMessages.negativeAge);
		}

		return input;
	}
}

module.exports = new User("users");
