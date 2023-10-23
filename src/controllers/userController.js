const createHttpError = require("http-errors");
const User = require("../models/user.schema");

/**
 * @desc Update user profile
 * @route PUT /api/v1/user/update
 * @access private
 */
const updateUser = async (req, res, next) => {
	try {
		const { email, caretakers, name } = req.body;
		const user = await User.findByIdAndUpdate(
			{ _id: req.session.userId },
			{
				name,
				email,
				caretakers,
			},
			{ new: true }
		);
		if (!user) {
			return next(
				createHttpError.InternalServerError(
					"Something went wrong, please try again."
				)
			);
		}
		res.status(200).json(user);
	} catch (error) {
		return next(
			createHttpError.InternalServerError(
				"Something went wrong, please try again."
			)
		);
	}
};

/**
 * @desc View user profile
 * @route GET /api/v1/user/profile
 * @access private
 */
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
		return next(
			createHttpError.InternalServerError(
				"Something went wrong please try again."
			)
		);
	}
};

/**
 * @desc View user profile
 * @route GET /api/v1/user/:email
 * @access public
 */
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
		return next(
			createHttpError.InternalServerError(
				"Something went wrong please try again."
			)
		);
	}
};

module.exports = { updateUser, getMe, getUserByEmail };
