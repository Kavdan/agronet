const db = require("../database");
const Sequelize = require("sequelize");

const postModel = db.define(
  "posts",
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: false,
    },
    markdown: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: true,
    },
    views: {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 0
    }, 
    comments: {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 0
    }
  },
  {
    timestamps: true,
  }
);

module.exports = postModel;
