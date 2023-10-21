const {
	setReminder,
	getAllReminders,
	getReminderById,
	deleteReminder,
} = require("../controllers/reminderController");
const validateSession = require("../middlewares/validateSession");

const router = require("express").Router();

router.route("/set").post(validateSession, setReminder);
router.route("/getAll").get(validateSession, getAllReminders);
router.route("/:id").get(getReminderById).put().delete(deleteReminder);

module.exports = router;
