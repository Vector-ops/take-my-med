const createHttpError = require("http-errors");

const notFound = (req, res, next) => {
	next(createHttpError.NotFound("Page does not exist"));
};

module.exports = notFound;
