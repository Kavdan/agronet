const db = require("../database");
const Sequelize = require("sequelize");

const emailVerificationModel = db.define('email_verification', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    activation_link: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

module.exports = emailVerificationModel