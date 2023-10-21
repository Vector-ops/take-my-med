const {
	userLogin,
	userRegister,
	userLogout,
	getMe,
	getUserByEmail,
} = require("../controllers/userController");
const validateSession = require("../middlewares/validateSession");

const router = require("express").Router();

router.route("/login").post(userLogin);
router.route("/signup").post(userRegister);
router.route("/logout").post(userLogout);
router.route("/me").get(validateSession, getMe);
router.route("/me/:email").get(validateSession, getUserByEmail);

module.exports = router;
