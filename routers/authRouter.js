const express = require("express");
const { validateBody } = require("../helpers/validateBody");
const { registSchema, loginSchema, verifyEmailSchema } = require("../schemas/schemas");
const {upload} = require("../middleware/upload")

const { registration, login, currentUser, logout, subscription, uploadAvatar, verifyUser, verifyEmailResend } = require("../controllers/auth");
const { authorize } = require("../middleware/authorize");

const router = express.Router();

router.post("/register", validateBody(registSchema), registration);
router.post("/login", validateBody(loginSchema), login);
router.post("/logout", authorize, logout);
router.post("/verify", validateBody(verifyEmailSchema), verifyEmailResend);

router.get("/current", authorize, currentUser);
router.get("/verify/:verificationToken", verifyUser);

router.patch("/", authorize, subscription);
router.patch("/avatars", authorize, upload.single("avatar"), uploadAvatar);

module.exports = router;