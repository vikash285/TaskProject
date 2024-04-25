const Post = require("../models/post");
const Reply = require("../models/reply");
const User = require("../models/user");
const { Op } = require("sequelize");

const postSection = async (req, res) => {
  try {
    const pId = req.query.pId;
    const isAdmin = req.user.isAdmin;
    if (isAdmin) {
      const post = await Post.findOne({ where: { id: pId } });
      const replies = await Reply.findAll({ where: { postId: pId } });
      const userIds = replies.map((uId) => uId.userId);
      const users = await User.findAll({ where: { id: { [Op.or]: userIds } } });

      const arr = replies.map((r) => {
        const u = users.filter((u) => {
          return u.id == r.userId;
        });
        return { user: u[0].firstName, reply: r.reply };
      });

      res.status(200).json({ arr, post });
    } else {
      res.status(400).json({ message: "Only admin can view postSeciton!" });
    }
  } catch (err) {
    res.status(500).json({ message: "Could not get postSection!" });
  }
};

const post = async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { postSection, post };
