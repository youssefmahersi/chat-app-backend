const express = require("express");
const allControllers = require("../../controllers/all/all");
const authMiddleware = require("../../utils/auth.midellware");
const router = express.Router();

//Get methods
router.get("/get-home",authMiddleware,allControllers.getUser);
router.get("/get-channel/:channelId",authMiddleware,allControllers.getChannel);
router.get("/search-channel",authMiddleware,allControllers.searchChannel);

// //Post methods
router.post("/create-channel",authMiddleware,allControllers.createChannel);
router.post("/send-message",authMiddleware,allControllers.sendMessage);

module.exports = router;