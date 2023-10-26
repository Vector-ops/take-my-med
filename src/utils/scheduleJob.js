const schedule = require("node-schedule");
const { getScheduleRule } = require("./getDate");
const redisClient = require("../db/redis_init");
const sendEmail = require("./sendEmail");
const getJobName = require("./genJobName");
const createHttpError = require("http-errors");

const scheduleJob = async (
	id,
	title,
	description,
	time,
	days,
	recur,
	email
) => {
	const rule = recur === true ? getScheduleRule(time, days) : time;
	const name = getJobName();
	schedule.scheduleJob(name, rule, () => {
		sendEmail(title, description, email);
		console.log(`Reminder sent to ${email}\n${title}\n${description}`);
		redisClient.hDel("reminders", id);
	});
	redisClient.hSet("reminders", id, name);
};

const cancelReminder = async (id) => {
	try {
		const jobName = await redisClient.hGet("reminders", id);
		const job = schedule.scheduledJobs[jobName];
		if (!job) {
			return next(createHttpError.NotFound("Reminder does not exist."));
		}
		await redisClient.hDel("reminders", id);
		job.cancel();
	} catch (error) {
		return next(
			createHttpError.InternalServerError(
				"Something went wrong, try again."
			)
		);
	}
};

const updateJob = async (id, title, description, time, days, recur, email) => {
	const jobName = await redisClient.hGet("reminders", id);
	const job = schedule.scheduledJobs[jobName];
	await redisClient.hDel("reminders", id);
	job.cancel();
	scheduleJob(id, title, description, time, days, recur, email);
};
module.exports = { scheduleJob, cancelReminder, updateJob };
