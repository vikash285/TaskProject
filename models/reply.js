const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Reply = sequelize.define("reply", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  reply: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Reply;
