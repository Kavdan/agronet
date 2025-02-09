const db = require("../database");
const Sequelize = require("sequelize");

const roleModel = db.define("roles", {
  id: {
    type: Sequelize.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  role: {
    type: Sequelize.DataTypes.STRING,
    unique: true,
    allowNull: false
  }
});


module.exports = roleModel;
