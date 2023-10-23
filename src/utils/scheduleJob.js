const schedule = require("node-schedule");
const { getScheduleRule } = require("./getDate");
const redisClient = require("../db/redis_init");
const sendEmail = require("./sendEmail");
const getJobName = require("./genJobName");

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
		redisClient.hDel("reminders", id);
	});
	redisClient.hSet("reminders", id, "newReminder");
};

const cancelReminder = async (id) => {
	const jobName = await redisClient.hGet("reminders", id);
	const job = schedule.scheduledJobs[jobName];
	await redisClient.hDel("reminders", id);
	job.cancel();
};

const updateJob = async (id, title, description, time, days, recur, email) => {
	const jobName = await redisClient.hGet("reminders", id);
	const job = schedule.scheduledJobs[jobName];
	await redisClient.hDel("reminders", id);
	job.cancel();
	scheduleJob(id, title, description, time, days, recur, email);
};
module.exports = { scheduleJob, cancelReminder, updateJob };
