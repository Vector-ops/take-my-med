const validateSession = (req, res, next) => {
	if (!req.session.userId) {
		return res.status(401).json({ authenticated: false });
	} else {
		next();
	}
};

module.exports = validateSession;
