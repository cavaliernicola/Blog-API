const { expect } = require("@jest/globals");

expect.extend({
	nullOrString(received, expected) {
		if (
			received === null ||
			received === undefined ||
			typeof received == "string" ||
			received instanceof String
		) {
			return {
				pass: true,
				message: () =>
					`expected null or string, but received ${this.utils.printReceived(
						received
					)}`,
			};
		}
	},
});
