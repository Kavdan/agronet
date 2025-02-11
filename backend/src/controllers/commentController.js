const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");
const commentService = require("../services/commentService");

class CommentController {
    async createComment(req, res, next){
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            if(!req.user) return next(ApiError.UnauthorizedError);

            const user = req.user;
            let {postId, parentId, content} = req.body;

            if(!postId) next(ApiError.BadRequest("Что тут неправильно!"));
            if(!content) next(ApiError.BadRequest("Комментарий не может быть пустым!"));
            
            const comment = await commentService.createComment(postId, user.id, parentId, content);

            return res.json(comment);
        } catch (e) {
            next(e);
        }
    }

    async removeComment(req, res, next){
        try {
            if(!req.user) return next(ApiError.UnauthorizedError);
            const user = req.user;

            const {commentId} = req.body;

            if(!commentId) return next(ApiError.BadRequest("Такого комментария не существует!"));
            
            const comment = await commentService.removeComment(commentId, user.id);

            return res.json(comment);
        } catch (e) {
            next(e);
        }
    }

    async updateComment(req, res, next){
        try {
            if(!req.user) return next(ApiError.UnauthorizedError);
            const user = req.user;

            const {commentId, content} = req.body;

            if(!commentId) return next(ApiError.BadRequest("Такого комментария не существует!"));
            if(!content) return next(ApiError.BadRequest("Неккоректный комментарий!"));
            
            const comment = await commentService.updateComment(commentId, user.id, content);

            return res.json(comment);
        } catch (e) {
            next(e);
        }
    }

    async getAllByPostId(req, res, next) {
        try {
            const {postId} = req.body;

            if(!postId) return next(ApiError.BadRequest("Такого поста не существует!"));

            const comments = await commentService.getAllByPostId(postId);
            return res.json(comments);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new CommentController();