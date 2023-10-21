const errorHandler = (err, req, res, next) => {
	const status = err.status ? err.status : 500;
	const message = err.message ? err.message : "Internal Server Error";
	res.status(status).json({
		error: message,
		status,
	});
};

module.exports = errorHandler;
