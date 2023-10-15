const Model = require("../models/model");
const database = require("./database");

const connectDB = async () => {
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
