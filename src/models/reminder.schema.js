const mongoose = require("mongoose");

const reminderSchema = mongoose.Schema(
	{
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		caretakers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		time: {
			type: Date,
			required: true,
		},
		days: [{ type: Number, required: true }],
		recur: {
			type: Boolean,
			required: true,
		},
	},
	{ timestamps: true }
);

const Reminder = mongoose.model("Reminder", reminderSchema);

module.exports = Reminder;
