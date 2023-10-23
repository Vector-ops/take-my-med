const crypto = require("crypto");

const getJobName = () => {
	const name = crypto.randomBytes(32).toString("hex");
	return name;
};

module.exports = getJobName;
