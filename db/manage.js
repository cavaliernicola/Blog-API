const Model = require("../models/model");
const database = require("./database");

const connectDB = async () => {
	// make sure the database time is UTC for more consistent data
	// alternatively you can use local time by passing moment().format("Z")
	await database.raw("SET @@global.time_zone = ?", ["+00:00"]);
	await database.raw("SET @@session.time_zone = ?", ["+00:00"]);

	// Make sure the database tables are properly created before trying to access them.
	for (let model of Model.children) {
		await model.init();
	}
};

const deleteEverything = async () => {
	for (let ch of Model.children) {
		// Delete content from each table
		await database(ch.tableName).del();
	}
};

module.exports = { connectDB, deleteEverything };
