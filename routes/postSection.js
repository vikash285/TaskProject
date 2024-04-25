const express = require("express");
const router = express.Router();
const middleware = require("../middleware/auth");
const postSectionController = require("../controllers/postSection");

// /postSection?pId=1 (post section for a chosen post)
router.get("/postSection", middleware.Auth, postSectionController.postSection);
router.get("/post", postSectionController.post);

module.exports = router;
