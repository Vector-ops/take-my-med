const createHttpError = require("http-errors");
const Reminder = require("../models/reminder.schema");
const User = require("../models/user.schema");
const { scheduleJob, cancelReminder } = require("../utils/scheduleJob");
const getCaretakers = require("../utils/getCaretakers");

/**
 * @desc Set reminder
 * @route POST /api/v1/reminder/set
 * @access private
 */
const setReminder = async (req, res, next) => {
	try {
		const { title, description, caretakers, time, days, recur } = req.body;
		const reminder = await Reminder.create({
			title,
			description,
			caretakers,
			time,
			days,
			recur,
		});
		const user = await User.findOne({ _id: req.session.userId });
		if (!user) {
			req.session.destroy();
			return next(
				createHttpError.Unauthorized("Please login and try again.")
			);
		}
		user.reminders.push(reminder._id);
		await user.save();
		const email = await getCaretakers(caretakers);
		email.push(user.email);
		scheduleJob(reminder.id, title, description, time, days, recur, email);
		res.status(200).json({ reminder, user });
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
 * @desc Get all reminders
 * @route GET /api/v1/reminder/getAll
 * @access private
 */
const getAllReminders = async (req, res, next) => {
	try {
		const user = await User.findOne({ _id: req.session.userId })
			.populate("reminders")
			.exec();
		if (!user) {
			return next(createHttpError.NotFound());
		}
		return res.status(200).json({ reminders: user.reminders });
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
 * @desc Get reminder using id
 * @route GET /api/v1/reminder/:id
 * @access private
 */
const getReminderById = async (req, res, next) => {
	try {
		const user = await User.findOne({ _id: req.session.userId }).populate(
			"reminders"
		);
		if (!user) {
			await req.session.destroy();
			return next(createHttpError.Unauthorized("Please login again."));
		}
		if (!user.reminders) {
			return res.status(200).json({ message: "No reminders." });
		}
		const reminder = user.reminders.find((reminder) =>
			reminder._id.equals(req.params.id)
		);
		if (!reminder) {
			return next(createHttpError.NotFound("Reminder not found."));
		}
		res.status(200).json({ reminder });
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
 * @desc Delete reminder
 * @route DELETE /api/v1/reminder/:id
 * @access private
 */
const deleteReminder = async (req, res, next) => {
	try {
		const user = await User.findOne({ _id: req.session.userId });
		if (!user) {
			await req.session.destroy();
			return next(createHttpError.Unauthorized("Please login again."));
		}
		if (!user.reminders) {
			return res.status(200).json({ message: "No reminders." });
		}
		cancelReminder(req.params.id);
		await Reminder.findByIdAndDelete({ _id: req.params.id });
		user.reminders.pull(req.params.id);
		await user.save();
		return res.status(200).json({ reminder: user.reminders });
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
 * @desc Update reminder
 * @route PUT /api/v1/reminder/:id
 * @access private
 */

const updateReminder = async (req, res, next) => {
	try {
		const email = [];
		const { title, description, caretakers, time, days, recur } = req.body;
		const user = await User.findOne({ _id: req.session.userId });
		if (!user) {
			req.session.destroy();
			return next(
				createHttpError.Unauthorized("Please login and try again.")
			);
		}
		email.push(user.email);
		const reminder = await Reminder.findByIdAndUpdate(
			{
				_id: req.params.id,
			},
			{ title, description, caretakers, time, days, recur },
			{ new: true, runValidators: true }
		)
			.populate("caretakers")
			.exec();
		if (!reminder) {
			return next(createHttpError.NotFound("Reminder not found."));
		}
		reminder.caretakers.forEach((caretaker) => {
			email.push(caretaker.email);
		});
		scheduleJob(
			req.params.id,
			reminder.title,
			reminder.description,
			reminder.time,
			reminder.days,
			reminder.recur,
			email
		);
		res.status(200).json(reminder);
	} catch (error) {
		console.error(error);
		return next(
			createHttpError.InternalServerError(
				"Something went wrong please try again."
			)
		);
	}
};

module.exports = {
	setReminder,
	getAllReminders,
	getReminderById,
	deleteReminder,
	updateReminder,
};
