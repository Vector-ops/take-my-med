const redis = require("redis");

const client = redis.createClient({});

client.on("error", (err) => console.error("Redis client error ", err));

client.on("ready", () => {
	console.log("Redis client is ready.");
});

client.on("disconnect", () => console.log("Disconnected from redis client."));

process.on("SIGINT", async () => {
	await client.quit();
	process.exit(0);
});

module.exports = client;
