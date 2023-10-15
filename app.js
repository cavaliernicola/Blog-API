require("express-async-errors");

const express = require("express");

// Security packages
const helmet = require("helmet");
const cors = require("cors");
const rateLimiter = require("express-rate-limit");

const usersRoute = require("./routes/user");
const postsRoute = require("./routes/post");
const interactionsRoute = require("./routes/interaction");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const app = express();

app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000,
		max: 100,
	})
);
app.use(helmet());
app.use(cors());
app.use(express.json());

// routes
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/posts", postsRoute);
app.use("/api/v1/interactions", interactionsRoute);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
