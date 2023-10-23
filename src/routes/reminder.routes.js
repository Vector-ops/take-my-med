const {
	setReminder,
	getAllReminders,
	getReminderById,
	deleteReminder,
	updateReminder,
} = require("../controllers/reminderController");
const validateSession = require("../middlewares/validateSession");

const router = require("express").Router();

router.route("/set").post(validateSession, setReminder);
router.route("/getAll").get(validateSession, getAllReminders);
router
	.route("/:id")
	.get(validateSession, getReminderById)
	.put(validateSession, updateReminder)
	.delete(validateSession, deleteReminder);

module.exports = router;
