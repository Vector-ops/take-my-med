const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: process.env.EMAIL_PORT,
	secure: false,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASSWORD,
	},
});

const sendEmail = async (title, description, email) => {
	const mailOptions = {
		from: "TakeMyMed",
		to: email,
		subject: title,
		text: description,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error(error);
		} else {
			console.log(`Email sent: ${info.response}`);
		}
	});
};

module.exports = sendEmail;
