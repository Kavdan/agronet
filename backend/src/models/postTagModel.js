const db = require("../database");
const Sequelize = require("sequelize");

const postTagModel = db.define(
    "post_tags",
    {
      post_id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        onDelete: "CASCADE", 
      },
      tag_id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    {
      timestamps: false, // Если в таблице нет createdAt и updatedAt
    }
);

module.exports = postTagModel;