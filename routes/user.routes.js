const express = require("express");
const { registerUser ,loginUser} = require("../security/user.security");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
module.exports = router;