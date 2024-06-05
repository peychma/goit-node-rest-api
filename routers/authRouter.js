const express = require("express");
const { validateBody } = require("../helpers/validateBody");
const { registSchema, loginSchema } = require("../schemas/schemas");
const {upload} = require("../middleware/upload")

const { registration, login, currentUser, logout, subscription, uploadAvatar } = require("../controllers/auth");
const { authorize } = require("../middleware/authorize");

const router = express.Router();

router.post("/register", validateBody(registSchema), registration);
router.post("/login", validateBody(loginSchema), login);
router.post("/logout", authorize, logout);

router.get("/current", authorize, currentUser);
router.patch("/", authorize, subscription);
router.patch("/avatars", authorize, upload.single("avatar"), uploadAvatar);

module.exports = router;