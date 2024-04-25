const express = require("express");
const app = express();
require("dotenv").config();

const cors = require("cors");
const sequelize = require("./util/database");
const bodyParser = require("body-parser");

const User = require("./models/user");
const Post = require("./models/post");
const PostUser = require("./models/postUser");
const Reply = require("./models/reply");

const userRoute = require("./routes/user");
const postRoute = require("./routes/post");
const postSectionRoute = require("./routes/postSection");

app.use(bodyParser.json());
app.use(cors());
const httpServer = require("http").Server(app);
const io = require("socket.io")(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.use("/user", userRoute);
app.use("/post", postRoute);
app.use("/postSection", postSectionRoute);

User.hasMany(Reply);
Reply.belongsTo(User);

Post.belongsToMany(User, { through: PostUser });
User.belongsToMany(Post, { through: PostUser });

Post.hasMany(Reply);
Reply.belongsTo(Post);

sequelize
  //   .sync({ force: true })
  .sync()
  .then(() => {
    httpServer.listen(3000, () => console.log("server running on port 3000"));
  })
  .catch((err) => console.log(err));

io.on("connection", (socket) => {
  console.log("Connected");
  socket.on("send-reply", () => {
    socket.broadcast.emit("get-reply");
  });
});
