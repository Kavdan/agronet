const db = require("../database");
const Sequelize = require("sequelize");

const postTagModel = db.define("post_tags", {}, { timestamps: false });

module.exports = postTagModel;