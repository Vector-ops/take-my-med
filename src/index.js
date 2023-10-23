const express = require("express");
require("dotenv").config();
const { ConnectDB } = require("./db/mongo_init");
const errorHandler = require("./middlewares/errorHandler");
const notFound = require("./middlewares/notFound");
const authRouter = require("./routes/auth.routes");
const store = require("./db/mongo_session_init");
const session = require("express-session");
const reminderRoutes = require("./routes/reminder.routes");
const client = require("./db/redis_init");
const userRouter = require("./routes/user.routes");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(
	session({
		name: "sid",
		secret: process.env.SESSION_SECRET,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
		},
		store: store,
		resave: true,
		saveUninitialized: true,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/reminder", reminderRoutes);
app.use(notFound);
app.use(errorHandler);

const bootstrap = async () => {
	try {
		await ConnectDB(process.env.MONGO_URI, process.env.MONGO_DB);
		await client.connect();
		app.listen(PORT, () => {
			console.log(`Server listening at http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error(error);
	}
};

bootstrap();
