const session = require("express-session");
const { getClient } = require("./mongo_init");
const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
	uri: "mongodb://localhost:27017",
	databaseName: process.env.MONGO_DB,
	collection: "Sessions",
	client: getClient,
});

// Catch errors
store.on("error", function (error) {
	console.log(error);
});

module.exports = store;
