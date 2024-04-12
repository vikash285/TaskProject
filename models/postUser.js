const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const PostUser = sequelize.define("postUser", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
});

module.exports = PostUser;
