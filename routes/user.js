const express = require("express");
const userController = require("../controllers/user");
const middleware = require("../middleware/auth");
const router = express.Router();
const multer = require("multer");

const upload = multer({ dest: "public/" });

router.post("/addUser", middleware.Auth, userController.addUser);
router.post("/logIn", userController.logIn);
router.post(
  "/upload",
  upload.single("addUsers"),
  middleware.Auth,
  userController.uploadUserData
);
router.get("/getUsers", middleware.Auth, userController.getUsers);

module.exports = router;
