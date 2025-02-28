const db = require("../database");
const Sequelize = require("sequelize");
const tagModel = require("./tagModel");
const PhotoModel = require("./photoModel");

const postModel = db.define(
  "posts",
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
    title: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: false,
    },
    markdown: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: true,
    },
    views: {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 0
    }, 
    comments: {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 0
    }
  },
  {
    timestamps: true,
  }
);

postModel.searchPosts = async function (query, limit, offset) {
  const { count, rows: posts } = await postModel.findAndCountAll({
    where: {
      [Sequelize.Op.or]: [
        { title: { [Sequelize.Op.iLike]: `%${query}%` } }, // Поиск по title
        { content: { [Sequelize.Op.iLike]: `%${query}%` } }, // Поиск по content
      ],
    },
    include: [{
      model: tagModel,
      through: { attributes: [] }, // Исключаем атрибуты из таблицы связей
      attributes: ['name'], // Только названия тегов
    },
    {
      model: PhotoModel, // Включаем фотографии
      as: "photos", // Псевдоним для связи
      attributes: ["filename", "path"], // Выбираем нужные поля
    },
    ],
    limit: limit, // Количество постов на странице
    offset: offset, // Смещение
    distinct: true
  });

  return { count, posts };
};

module.exports = postModel;
