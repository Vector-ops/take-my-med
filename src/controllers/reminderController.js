const createHttpError = require("http-errors");
const Reminder = require("../models/reminder.schema");
const User = require("../models/user.schema");

//@desc Set reminder
//@route POST /api/v1/reminder/set
//@access private
const setReminder = async (req, res, next) => {
	try {
		const { title, description, caretakers, time, days, recur } = req.body;
		const reminder = await Reminder.create({
			user_id: req.session.userId,
			title,
			description,
			caretakers,
			time,
			days,
			recur,
		});
		const user = await User.findOne({ _id: req.session.userId });
		user.reminders.push(reminder._id);
		await user.save();
		res.status(200).json({ reminder, user });
	} catch (error) {
		console.error(error);
	}
};

//@desc Get all reminders
//@route GET /api/v1/reminder/getAll
//@access private
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
	}
};

//@desc Get reminder using id
//@route GET /api/v1/reminder/:id
//@access private
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
	}
};

//@desc Delete reminder
//@route DELETE /api/v1/reminder/:id
//@access private
const deleteReminder = async (req, res, next) => {
	try {
		const user = await User.findByIdAndUpdate({ _id: req.session.userId });
		if (!user) {
			await req.session.destroy();
			return next(createHttpError.Unauthorized("Please login again."));
		}
		if (!user.reminders) {
			return res.status(200).json({ message: "No reminders." });
		}
		user.reminders.pull(req.params.id);
		await user.save();
		return res.status(200).json({ reminder: user.reminders });
	} catch (error) {
		console.error(error);
	}
};

module.exports = {
	setReminder,
	getAllReminders,
	getReminderById,
	deleteReminder,
};
