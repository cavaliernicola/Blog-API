const enviroment = process.env.NODE_ENV || "production";
const knexfile = require("../knexfile");

const config = knexfile[enviroment];
const knex = require("knex")(config);

module.exports = knex;
