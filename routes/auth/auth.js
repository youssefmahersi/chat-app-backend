const express = require("express");
 
const router = express.Router();
const authController = require("../../controllers/auth/auth");
router.post("/auth",authController.auth);

router.get("/logout",authController.logout);



module.exports = router;