const db = require("../database");
const PostDto = require("../dtos/postDto");
const ApiError = require("../exceptions/api-error");
const postModel = require("../models/postModel");
const postTagModel = require("../models/postTagModel");
const tagModel = require("../models/tagModel");
const userModel = require("../models/userModel");
const tagService = require("./tagService");

class PostService {
  async createPost(userId, title, content, tags = []) {
    const transaction = await db.transaction({ autocommit: false });

    try {
      const user = await userModel.findOne({
        where: { id: userId },
        transaction,
      });
      if (!user) throw ApiError.UnauthorizedError();

      const post = await postModel.create(
        { user_id: userId, title, content },
        { transaction }
      );
      const postData = new PostDto(post);

      await tagService.addTags(post.id, tags, transaction);

      transaction.commit();
      return postData;
    } catch (e) {
      transaction.rollback();
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

      transaction.commit();
      return postData;
    } catch (e) {
      transaction.rollback();
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

      transaction.commit();
      return postData;
    } catch (e) {
      transaction.rollback();
      throw e;
    }
  }
}

module.exports = new PostService();
