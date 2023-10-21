const createHttpError = require("http-errors");
const User = require("../models/user.schema");
const authSchema = require("../utils/validation");

//@desc User login
//@route POST /api/v1/auth/login
//@access public
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

//@desc Register a user
//@route POST /api/v1/auth/register
//@access public
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

//@desc User logout
//@route GET /api/v1/auth/logout
//@access public
const userLogout = async (req, res, next) => {
	await req.session.destroy((err) => {
		if (err) {
			return next(createHttpError.InternalServerError());
		}
	});
	res.status(200).json({ message: "Logout successful." });
};

//@desc View user profile
//@route GET /api/v1/auth/profile
//@access private
const getMe = async (req, res, next) => {
	try {
		const user = await User.findOne({ _id: req.session.userId });
		if (!user) {
			req.session.destroy();
			return next(
				createHttpError.Unauthorized("Please login and try again")
			);
		}
		res.status(200).json({
			id: user._id,
			name: user.name,
			email: user.email,
			reminders: user.reminders,
		});
	} catch (error) {
		console.error(error);
	}
};

//@desc View user profile
//@route GET /api/v1/auth/user/:email
//@access public
const getUserByEmail = async (req, res, next) => {
	try {
		const user = await User.findOne({ email: req.params.email });
		if (!user) {
			req.session.destroy();
			return next(
				createHttpError.Unauthorized("Please login and try again.")
			);
		}
		res.status(200).json({
			id: user._id,
			name: user.name,
		});
	} catch (error) {
		console.error(error);
	}
};

module.exports = { userLogin, userLogout, userRegister, getMe, getUserByEmail };
