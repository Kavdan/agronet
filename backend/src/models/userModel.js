const db = require("../database");
const Sequelize = require("sequelize");

const userModel = db.define("users", {
  id: {
    type: Sequelize.DataTypes.STRING,
    primaryKey: true,
  },
  email: {
    type: Sequelize.DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  username: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  password_hash: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  role_id: {
    type: Sequelize.DataTypes.INTEGER,
    defaultValue: 1
  },
  latitude: {
    type: Sequelize.DataTypes.FLOAT,
    allowNull: true
  },
  longitude: {
    type: Sequelize.DataTypes.FLOAT,
    allowNull: true
  }
});


module.exports = userModel;
