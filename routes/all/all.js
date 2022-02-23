const express = require("express");
const allControllers = require("../../controllers/all/all");
const authMiddleware = require("../../utils/auth.midellware");
const router = express.Router();

//Get methods
router.get("/get-home",authMiddleware,allControllers.getUser);
router.get("/get-channel/:channelId",authMiddleware,allControllers.getChannel);

// //Post methods
router.post("/search-channel",authMiddleware,allControllers.searchChannel);
router.post("/create-channel",authMiddleware,allControllers.createChannel);

module.exports = router;
