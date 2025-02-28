const db = require("../database");
const ApiError = require("../exceptions/api-error");
const PhotoModel = require("../models/photoModel");

class PhotoService {
  async addPhoto(description, userId, file, postId, commentId) {
    const transaction = await db.transaction({ autocommit: false });

    try {
      const photo = await PhotoModel.create({
        filename: file.filename,
        path: file.path,
        description: description || null,
        userId: userId,
        postId: postId || null,
        commentId: commentId || null,
      }, {transaction});

      await transaction.commit();

      return photo;
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }

  async updatePhoto(id, description, postId, file, userId, commentId) {
    const transaction = await db.transaction({autocommit: false});
    try {
        const photo = await PhotoModel.findOne({
            where: {
                id,
                userId
            },
            transaction
        });

        if (!photo) {
            throw ApiError.BadRequest("Photo not found!");
        }

        if (file) {
            photo.filename = file.filename;
            photo.path = file.path;
        }

        if (description) {
            photo.description = description;
        }

        if (postId) {
            photo.postId = postId;
        }

        if (commentId) {
            photo.commentId = commentId;
        }

        await photo.save();
        await transaction.commit();

        return photo;
    } catch (e) {
        await transaction.rollback();
        throw e;
    }
  }

  async removePhoto(id, userId) {
    const transaction = await db.transaction({autocommit: false});
    try {
        const photo = await PhotoModel.findOne({
            where: {
                id,
                userId
            },
            transaction
        });

        if(!photo)
            throw ApiError.BadRequest("Photo not found!");

        await photo.destroy({transaction});

        await transaction.commit();

        return photo;
    } catch (e) {
        await transaction.rollback();
        throw e;
    }
  }

  async getPhotosById(id) {
    const photos = await PhotoModel.findAll({where: {postId: id}});
    return photos;
  }
}

module.exports = new PhotoService();
