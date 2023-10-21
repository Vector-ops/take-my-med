const createHttpError = require("http-errors");
const User = require("../models/user.schema");
const authSchema = require("../utils/validation");

const userLogin = async (req, res, next) => {
	try {
		const validation = await authSchema.validateAsync(req.body);
		const user = await User.findOne({ email: validation.email });
		if (!user) {
			return next(
				createHttpError.Unauthorized("Invalid email or password")
			);
		}
		req.session.userId = user._id;
		res.status(200).json({
			message: "Login successful.",
			email: user.email,
		});
	} catch (error) {
		console.error(error);
	}
};
const userRegister = async (req, res, next) => {
	try {
		const validation = await authSchema.validateAsync(req.body);
		const userExists = await User.findOne({ email: validation.email });
		if (userExists) {
			return next(createHttpError.Conflict("User already exists."));
		}
		const user = await User.create(validation);

		res.status(200).json({ name: user.name, email: user.email });
	} catch (error) {
		console.error(error);
	}
};
const userLogout = async (req, res, next) => {
	await req.session.destroy((err) => {
		if (err) {
			return next(createHttpError.InternalServerError());
		}
	});
	res.status(200).json({ message: "Logout successful." });
};

const getMe = async (req, res, next) => {
	try {
		const user = await User.findOne({ _id: req.session.userId });
		if (!user) {
			return next(createHttpError.NotFound("User does not exist."));
		}
		res.status(200).json(user);
	} catch (error) {
		console.error(error);
	}
};

const getUserByEmail = async (req, res, next) => {
	try {
		const user = await User.findOne({ email: req.params.email });
		if (!user) {
			return next(createHttpError.NotFound("User does not exist."));
		}
		res.status(200).json(user);
	} catch (error) {
		console.error(error);
	}
};

module.exports = { userLogin, userLogout, userRegister, getMe, getUserByEmail };
