const schedule = require("node-schedule");
const { getScheduleRule } = require("./getDate");
const redisClient = require("../db/redis_init");

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
	schedule.scheduleJob("newReminder", rule, () => {
		console.log(
			`Reminder set for ${id} to ${email}\n${title}\n${description}`
		);
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
module.exports = { scheduleJob, cancelReminder };
