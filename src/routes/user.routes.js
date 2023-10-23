const {
	getMe,
	getUserByEmail,
	updateUser,
} = require("../controllers/userController");
const validateSession = require("../middlewares/validateSession");

const router = require("express").Router();

router.route("/update").put(validateSession, updateUser);
router.route("/profile").get(validateSession, getMe);
router.route("/:email").get(getUserByEmail);

module.exports = router;
