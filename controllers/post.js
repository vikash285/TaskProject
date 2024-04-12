const Post = require("../models/post");
const PostUser = require("../models/postUser");
const Reply = require("../models/reply");

const createPost = async (req, res) => {
  try {
    const isAdmin = req.user.isAdmin;
    const { title, content } = req.body;
    if (isAdmin) {
      await Post.create({ title, content });
      res.status(201).json({ message: "New post created!" });
    } else {
      res.status(400).json({ message: "Only admin can post!" });
    }
  } catch (err) {
    res.status(500).json({ message: "Could not create post!" });
  }
};

const sharePost = (req, res) => {
  try {
    const isAdmin = req.user.isAdmin;
    const userId = req.query.uId.split(",");
    const postId = req.query.pId;
    if (isAdmin) {
      userId.forEach(async (element) => {
        await PostUser.create({ postId: postId, userId: element });
      });
      res.status(201).json({ message: "Post shared!" });
    } else {
      res.status(400).json({ message: "Only admin can share post!" });
    }
  } catch (err) {
    res.status(500).json({ message: "Could not share post!" });
  }
};

const replyToPost = async (req, res) => {
  try {
    const uId = req.user.id;
    const pId = req.query.pId;
    const { reply } = req.body;
    const ids = await PostUser.findAll({ where: { postId: pId } });
    const userIds = ids.map((id) => {
      return id.userId;
    });
    if (userIds.includes(uId)) {
      await Reply.create({ reply: reply, userId: uId, postId: pId });
      res.status(201).json({ message: "Replied to post!" });
    } else {
      res.status(404).json({ message: "Post is not shared with you!" });
    }
  } catch (err) {
    res.status(500).json({ message: "Could not reply to post!" });
  }
};

module.exports = { sharePost, replyToPost, createPost };
