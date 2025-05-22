// models/notificationModel.js
const db = require("../database");
const Sequelize = require("sequelize");

const notificationModel = db.define("notifications", {
  id: {
    type: Sequelize.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  post_id: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: true,
  },
  type: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: Sequelize.DataTypes.TEXT,
    allowNull: false,
  },
  is_read: {
    type: Sequelize.DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
});

module.exports = notificationModel;
