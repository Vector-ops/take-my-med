const mongoose = require("mongoose");
const argon = require("argon2");

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
		},
		reminders: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Reminder",
			},
		],
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	try {
		const hash = await argon.hash(this.password);
		this.password = hash;
		next();
	} catch (error) {
		next(error);
	}
});

userSchema.methods.isValidPassword = async function (password) {
	try {
		return await argon.verify(this.password, password);
	} catch (error) {
		throw error;
	}
};

const User = mongoose.model("User", userSchema);
module.exports = User;
