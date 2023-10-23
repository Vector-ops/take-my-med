const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	host: process.env.SMTP,
	port: process.env.MAIL_PORT,
	secure: false,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASSWORD,
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
