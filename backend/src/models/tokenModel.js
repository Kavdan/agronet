const db = require("../database");
const Sequelize = require("sequelize");

const refreshTokenModel = db.define('refresh_tokens', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    refresh_token: {
        type: Sequelize.DataTypes.STRING(300),
        allowNull: false,

    }
});

module.exports = refreshTokenModel