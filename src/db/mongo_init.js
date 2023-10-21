const mongoose = require("mongoose");

const ConnectDB = (url, DBName) => {
	return mongoose.connect(url, {
		dbName: DBName,
	});
};

mongoose.connection.on("connected", () => {
	console.log(
		"Connected to MongoDB: ",
		mongoose.connection.host,
		" ",
		mongoose.connection.name
	);
});

mongoose.connection.on("error", (e) => {
	console.error({ e });
});

mongoose.connection.on("disconnected", () => {
	console.log("MongoDB disconnected.");
});

process.on("SIGINT", async () => {
	await mongoose.connection.close();
	process.exit(0);
});

const getClient = () => {
	return mongoose.connection.getClient();
};

module.exports = { ConnectDB, getClient };
