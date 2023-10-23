const User = require("../models/user.schema");

const getCaretakers = async (caretakers) => {
	try {
		const emails = [];
		const caretaker = await User.find({ _id: caretakers });
		caretaker.forEach((ct) => {
			emails.push(ct.email);
		});
		return emails;
	} catch (error) {
		console.error(error);
		return [];
	}
};

module.exports = getCaretakers;
