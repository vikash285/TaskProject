const Reply = require("../models/reply");
const User = require("../models/user");
const { Op } = require("sequelize");

const postSection = async (req, res) => {
  try {
    const pId = req.query.pId;
    const isAdmin = req.user.isAdmin;
    if (isAdmin) {
      const replies = await Reply.findAll({ where: { postId: pId } });
      const userIds = replies.map((uId) => uId.userId);
      const users = await User.findAll({ where: { id: { [Op.or]: userIds } } });
      res.status(200).json({ users, replies });
    } else {
      res.status(400).json({ message: "Only admin can view postSeciton!" });
    }
  } catch (err) {
    res.status(500).json({ message: "Could not get postSection!" });
  }
};

module.exports = { postSection };
