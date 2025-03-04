const { where } = require("sequelize");
const db = require("../database");
const CommentDto = require("../dtos/commentDto");
const ApiError = require("../exceptions/api-error");
const commentModel = require("../models/commentModel");
const postModel = require("../models/postModel");
const userModel = require("../models/userModel");

const hlp = async (commentId, transaction, count) => {
    if (!commentId) return [];
    count.value++;
    const replies = [];
    const rpls = await commentModel.findAll({ 
        where: { parent_id: commentId }, 
        include: {model: userModel},
        transaction 
    });

    if (!rpls || rpls.length === 0) return [];

    for (let reply of rpls) {
        const nestedReplies = await hlp(reply.id, transaction, count); // Получаем вложенные комментарии
        replies.push({ ...reply.toJSON(), replies: nestedReplies }); // Добавляем replies в объект
    }

    return replies;
}

class CommentService {
    async createComment(post_id, user_id, parent_id, content) {
        const transaction = await db.transaction({autocommit: false});
        try {
            const post = await postModel.findOne({
                where: {id: post_id}, 
                include: [{ model: userModel, as: "user" }],
                transaction
            });
            const user = await userModel.findOne({where: {id: user_id}, transaction});
            let parent = null, parentUser = null;
            
            if(!post) throw ApiError.BadRequest("Такого поста не существует!");
            if(!user) throw ApiError.BadRequest("Такого пользователя не существует!");

            if(parent_id) {
                parent = await commentModel.findOne({where: {id: parent_id}, transaction});
                if(!parent) throw ApiError.BadRequest("Такого комментария не существует!");
                parentUser = await userModel.findOne({where: {id: parent.user_id}, transaction});
                if(!parentUser) throw ApiError.BadRequest("Такого комментария не существует!");
            }




            const comment = await commentModel.create(
                {post_id, user_id, parent_id, 
                 content: `@${(parentUser && parentUser.username) 
                            || (post.user && post.user.username)}, ${content}`
                }, 
                {transaction}
            );

            post.comments = post.comments < 0 ? 1 : post.comments + 1;
            await post.save();
            
            const commentData = new CommentDto(comment);

            await transaction.commit();
            return commentData;
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }

    async updateComment(commentId, userId, content) {
        const transaction = await db.transaction({autocommit: false});
        try {
            const comment = await commentModel.findOne({
                where: {id: commentId},
                include: {model: userModel, as: "user"}, 
                transaction
            });
            
            if(!comment) throw ApiError.BadRequest("Такого комментария не существует!");
            if(!comment.user) throw ApiError.BadRequest("Такого пользователя не существует!");
            if(!(comment.user.id === userId)) throw ApiError.BadRequest("Комментарий вам не принадлежит!");


            await commentModel.update(
                {content}, 
                {where: {id: commentId}, 
                returning: true,
                transaction}
            );

            const updatedComment = await commentModel.findOne({
                where: { id: commentId },
                transaction
            });
            
            const commentData = new CommentDto(updatedComment);

            await transaction.commit();
            return commentData;
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }


    async removeComment(commentId, userId) {
        const transaction = await db.transaction({autocommit: false});
        try {
            const comment = await commentModel.findOne({
                where: {id: commentId},
                include: {model: userModel, as: "user"}, 
                transaction
            });
            //const user = await userModel.findOne({where: {id: userId}, transaction});


            if(!comment) throw ApiError.BadRequest("Такого комментария не существует!");
            if(!comment.user) throw ApiError.BadRequest("Такого пользователя не существует!");
            if(!(comment.user.id === userId)) throw ApiError.BadRequest("Комментарий вам не принадлежит!");

            if(comment.post_id){
                const post = await postModel.findOne({
                    where: {
                        id: comment.post_id
                    }
                });

                if(post) {
                    post.comments = post.comments < 0 ? 0 : post.comments - 1;
                    await post.save();
                }
            }

            await comment.destroy({transaction});

            await transaction.commit();
            return {comment}
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }

    async getAllByPostId(post_id) {
        const transaction = await db.transaction({autocommit: false});
        try {
            const comments = await commentModel.findAll({
                where: {parent_id: null, post_id},
                include: {
                    model: userModel,
                    attributes: ['username']
                }
            });
            let coms = [];
            let count = {value: 0};
            for(let comm of comments){
                const res = await hlp(comm.id, transaction, count);
                coms.push({parent: comm, replies: res});
            }



            await transaction.commit();
            return {coms, count: count.value};
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }
}

module.exports = new CommentService();