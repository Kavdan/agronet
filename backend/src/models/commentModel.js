const db = require("../database");
const Sequelize = require("sequelize");

const commentModel = db.define("comments", {
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
    content: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: false,
    },
    parent_id: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true, 
    },
  }, {
    timestamps: true,
});

module.exports = commentModel;

