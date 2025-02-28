// models/Photo.js
const { Sequelize } = require("sequelize");
const db = require("../database");

const PhotoModel = db.define('photo', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    filename: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    path: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
    },
    userId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    postId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
    },
    commentId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'photos',
    timestamps: true,
});

module.exports = PhotoModel;