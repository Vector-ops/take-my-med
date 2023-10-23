const schedule = require("node-schedule");

const getScheduleRule = (time, days) => {
	const rule = new schedule.RecurrenceRule();
	const date = new Date(time);
	rule.hour = date.getHours();
	rule.minute = date.getMinutes();
	rule.second = date.getSeconds();
	rule.dayOfWeek = days;

	return rule;
};

module.exports = { getScheduleRule };
