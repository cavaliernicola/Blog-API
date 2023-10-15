require("dotenv").config();
const app = require("./app");
const { connectDB } = require("./db/manage");

const port = process.env.PORT || 3000;

const start = async () => {
	try {
		await connectDB();
		app.listen(port, console.log(`Listening to port ${port}...`));
	} catch (error) {
		console.log(error);
		console.log("Couldn't connect to the database.");
		process.exit(1);
	}
};

start();
