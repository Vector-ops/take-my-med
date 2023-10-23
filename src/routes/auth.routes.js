const {
	userLogin,
	userRegister,
	userLogout,
} = require("../controllers/authController");

const router = require("express").Router();

router.route("/login").post(userLogin);
router.route("/signup").post(userRegister);
router.route("/logout").post(userLogout);
module.exports = router;
