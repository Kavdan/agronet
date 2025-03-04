const db = require("../database");
const PostDto = require("../dtos/postDto");
const ApiError = require("../exceptions/api-error");
const commentModel = require("../models/commentModel");
const postModel = require("../models/postModel");
const postTagModel = require("../models/postTagModel");
const tagModel = require("../models/tagModel");
const userModel = require("../models/userModel");
const commentService = require("./commentService");
const tagService = require("./tagService");
const fs = require("fs");
const path = require("path");
const photoService = require("./photoService");

class PostService {
  async createPost(userId, title, content, tags = [], coordinates) {
    const transaction = await db.transaction({ autocommit: false });

    try {
      const user = await userModel.findOne({
        where: { id: userId },
        transaction,
      });
      if (!user) throw ApiError.UnauthorizedError();

      const post = await postModel.create(
        { user_id: userId, title, content, 
          longitude: coordinates.longitude || null, 
          latitude: coordinates.latitude || null },
        { transaction }
      );
      const postData = new PostDto(post);

      await tagService.addTags(post.id, tags, transaction);

      await transaction.commit();
      return postData;
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }

  async updatePost(userId, postId, title, content, tags = []) {
    const transaction = await db.transaction({ autocommit: false });

    try {
      const user = await userModel.findOne({where: {id: userId}, transaction});
      const post = await postModel.findOne({where: {id: postId}, transaction});

      if(!post) throw ApiError.BadRequest("Такого поста не существует!");
      if(!user) throw ApiError.BadRequest("Такого пользователя не существует!");

      const foundPost = await postModel.findOne({where: {id: postId, user_id: userId}, transaction});

      if(!foundPost) throw ApiError.BadRequest("Пост пренадлежит другому пользователю!");

      const newPost = await postModel.update(
        { title, content},
        { where: {id: postId}, transaction }
      );

      const postData = new PostDto({id: postId, title, content, user_id: userId});

      await tagService.addTags(post.id, tags, transaction);

      await transaction.commit();
      return postData;
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }

  async removePost(userId, postId) {
    const transaction = await db.transaction({ autocommit: false });

    try {
      const user = await userModel.findOne({where: {id: userId}, transaction});
      const post = await postModel.findOne({where: {id: postId}, transaction});

      if(!post) throw ApiError.BadRequest("Такого поста не существует!");
      if(!user) throw ApiError.BadRequest("Такого пользователя не существует!");

      const foundPost = await postModel.findOne({where: {id: postId, user_id: userId}, transaction});

      if(!foundPost) throw ApiError.BadRequest("Пост принадлежит другому пользователю!");

      await foundPost.destroy({transaction});

      const postData = new PostDto(foundPost);

      await transaction.commit();
      return postData;
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }

  async getAllPosts(query = '', page = 1, limit = 2) {
    try {
      const offset = (page - 1) * limit;
      const {count, posts} = await postModel.searchPosts(query, limit, offset);
  
      // const postsWithTags = posts.map(post => {
      //   const tags = post.tags.map(tag => tag.name); // Получаем массив названий тегов
      //   return {
      //     ...post.toJSON(),
      //     tags
      //   };
      // });

      const postsWithTagsAndPhotos = await Promise.all(
        posts.map(async (post) => {
            const tags = post.tags.map((tag) => tag.name); // Массив названий тегов

            // Преобразуем фотографии в base64
            const photos = await Promise.all(
                post.photos.map(async (photo) => {
                    const filePath = path.join(__dirname, "..", photo.path); // Полный путь к файлу
                    const fileData = fs.readFileSync(filePath); // Читаем файл
                    const base64 = fileData.toString("base64"); // Преобразуем в base64
                    return {
                        filename: photo.filename,
                        data: `data:image/jpeg;base64,${base64}`, // Формируем Data URL
                    };
                })
            );

            return {
                ...post.toJSON(),
                tags,
                photos,
            };
        })
    );
  
      return {
        posts: postsWithTagsAndPhotos,
        totalPosts: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      };
    } catch (error) {
      throw error;
    }
  }
  

  async getPostById(id) {
    const post = await postModel.findOne({where: {id}});
    const tags = await tagService.getTags(id);
    const photos = await photoService.getPhotosById(id);

    const photoBase64 = photos.map((photo) => {
      const filePath = path.join(__dirname, "..", photo.path);
      const fileData = fs.readFileSync(filePath); 
      const base64 = fileData.toString("base64"); 
      return {
          id: photo.id,
          filename: photo.filename,
          data: `data:image/jpeg;base64,${base64}`,
      };
  });

    const comments = await commentService.getAllByPostId(id);

    return {...post.dataValues, 
      tags, 
      comments: comments.coms,
      commentsCount: comments.count, 
      photos: photoBase64};
  }

  async getMyPosts(query = '', page = 1, limit = 2, user_id) {
    try {
      const offset = (page - 1) * limit;
      const {count, posts} = await postModel.searchPosts(query, limit, offset, user_id);
  
      const postsWithTagsAndPhotos = await Promise.all(
        posts.map(async (post) => {
            const tags = post.tags.map((tag) => tag.name); // Массив названий тегов

            const photos = await Promise.all(
                post.photos.map(async (photo) => {
                    const filePath = path.join(__dirname, "..", photo.path); // Полный путь к файлу
                    const fileData = fs.readFileSync(filePath); // Читаем файл
                    const base64 = fileData.toString("base64"); // Преобразуем в base64
                    return {
                        filename: photo.filename,
                        data: `data:image/jpeg;base64,${base64}`, // Формируем Data URL
                    };
                })
            );

            return {
                ...post.toJSON(),
                tags,
                photos,
            };
        })
    );
  
      return {
        posts: postsWithTagsAndPhotos,
        totalPosts: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      };
    } catch (error) {
      throw error;
    }
  }
  
}

module.exports = new PostService();
