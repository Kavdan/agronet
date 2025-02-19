const { Sequelize } = require("sequelize");
const db = require("../database");


const LikeModel = db.define(
    "likes",
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
      post_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      indexes: [{ unique: true, fields: ["user_id", "post_id"] }],
    }
  );

  module.exports = LikeModel;