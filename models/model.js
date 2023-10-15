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

	find(condition) {
		return database(this.tableName).where(condition);
	}

	findOne(condition) {
		return this.find(condition).first();
	}

	create(props) {
		delete props.id;
		return database(this.tableName)
			.insert(props)
			.returning("*")
			.then((result) => result[0]);
	}

	update(condition, props) {
		delete props.id;
		return database(this.tableName)
			.update(props)
			.where(condition)
			.returning("*")
			.then((result) => result[0]);
	}

	delete(condition) {
		return (
			database(this.tableName)
				.del()
				.where(condition)
				// delete statement return a number, we convert it to boolean
				.then((result) => !!result)
		);
	}
}

module.exports = Model;
