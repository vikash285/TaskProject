const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.Auth = async (req, res, next) => {
  try {
    const users = await User.findByPk(1);
    if (users) {
      const token = req.header("Authorization");
      const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_KEY);
      const user = await User.findByPk(decodedToken.userId);
      req.user = user;
    }
    // Perform authentication only when there is an entry in User table
    next();
  } catch (err) {
    res.status(401).json({ message: "Authentication failed!" });
  }
};
