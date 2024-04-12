const express = require("express");
const router = express.Router();
const postController = require("../controllers/post");
const middleware = require("../middleware/auth");

// /sharePost?uId=5,6&pId=3 (url for expample)
router.post("/sharePost", middleware.Auth, postController.sharePost);

router.post("/createPost", middleware.Auth, postController.createPost);
// /replyToPost?pId=2
router.post("/replyToPost", middleware.Auth, postController.replyToPost);

module.exports = router;
