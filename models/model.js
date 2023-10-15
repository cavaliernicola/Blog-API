const database = require("../db/database");

class Model {
	static children = [];

	constructor(tableName) {
		this.tableName = tableName;
		Model.children.push(this);
	}

	async init() {
		const result = await database.schema.hasTable(this.tableName);
		if (result) return;
		return database.schema.createTable(this.tableName, (table) => {
			this.initialStatement(table);
		});
	}

	async findOne(condition) {
		const result = await database(this.tableName).where(condition);
		result[0] ? delete result[0].id : undefined;
		return result[0];
	}

	async create(props) {
		const statement = database(this.tableName).insert(props);
		await statement;

		const result = await database(this.tableName)
			.select("*")
			.where(database.raw("id = LAST_INSERT_ID()"));

		result[0] ? delete result[0].id : undefined;
		return result[0];
	}

	async update(condition, props) {
		const statement = database(this.tableName).update(props).where(condition);
		await statement;

		const result = await database(this.tableName).select("*").where(condition);

		result[0] ? delete result[0].id : undefined;
		return result[0];
	}

	async delete(condition) {
		const result = await database(this.tableName).del().where(condition);
		// delete statement return a number, we convert it to boolean
		return !!result;
	}
}

module.exports = Model;
