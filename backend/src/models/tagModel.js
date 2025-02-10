const db = require("../database");
const Sequelize = require("sequelize");

const tagModel = db.define("tags", {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
  }, {
    timestamps: false,
  });
  
  module.exports = tagModel;