const postTagModel = require("../models/postTagModel");
const tagModel = require("../models/tagModel");

class TagService {
  async addTags(postId, tags, transaction) {
    if (tags && tags.length > 0)
      for (const tagName of tags) {
        let tag = await tagModel.findOne({
          where: { name: tagName },
          transaction,
        });

        if (!tag)
          tag = await tagModel.create({ name: tagName }, { transaction });
        if (!tag) throw ApiError.BadRequest("Ошибка с тегами!");

        const isRecordPostTag = await postTagModel.findOne({
          where: { tag_id: tag.id, post_id: postId },
        });
        if (!isRecordPostTag)
          await postTagModel.create(
            { post_id: postId, tag_id: tag.id },
            { transaction }
          );
      }
  }

  async getTags(post_id, all) {
    const postTags = await postTagModel.findAll({
      where: {post_id},
      include: {
        model: tagModel,
        attributes: ['name']
      },
      attributes: ['post_id', 'tag_id']
    });

    const tagNames = postTags.map(tag => tag.tag.name);
    return tagNames;
  }

}

module.exports = new TagService();