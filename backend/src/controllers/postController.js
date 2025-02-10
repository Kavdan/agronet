const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");
const postService = require("../services/postService");
const PostDto = require("../dtos/postDto");

function isValidTag(tag) {
    return /^[a-zа-яА-ЯA-Z0-9_]+$/.test(tag);
}

const MAX_TAG_LEN = 50, MIN_TAG_LEN = 2;

class PostController {
    async createPost(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            if(!req.user) return next(ApiError.UnauthorizedError);

            const user = req.user;
            let {title, content, tags} = req.body;

            if (tags && tags.length > 0) {
                tags = tags.split(',').map(tag => tag.trim()); 
            }

            for(const tag of tags) {
                if(tag.length > 0 && tag.length)
                if(!isValidTag(tag)) return next(ApiError.BadRequest("Теги невалидны", {tag}));
                if(tag.length < MIN_TAG_LEN || tag.length >= MAX_TAG_LEN) 
                    return next(ApiError.BadRequest("Теги не могут быть пустыми и их длина не должна превышать 50символов", 
                                                    {tag}));
            }

            
            const post = await postService.createPost(user.id, title, content, tags);

            return res.json({...(new PostDto(post)), ms: "Пост создан!"});
        } catch (e) {
            next(e);
        }
    }

    async updatePost(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            if(!req.user) return next(ApiError.UnauthorizedError);

            const user = req.user;
            let {title, content, tags, postId} = req.body;

            if(!postId) return next(ApiError.BadRequest("Укажите пост, который нужно обновить!"));

            if (tags && tags.length > 0) {
                tags = tags.split(',').map(tag => tag.trim()); 
            }

            for(const tag of tags) {
                if(tag.length > 0 && tag.length)
                if(!isValidTag(tag)) return next(ApiError.BadRequest("Теги невалидны", {tag}));
                if(tag.length < MIN_TAG_LEN || tag.length >= MAX_TAG_LEN) 
                    return next(ApiError.BadRequest("Теги не могут быть пустыми и их длина не должна превышать 50символов", 
                                                    {tag}));
            }

            
            const post = await postService.updatePost(user.id, postId, title, content, tags);

            return res.json({...(new PostDto(post)), ms: "Пост обновлен!"});
        } catch (e) {
            next(e);
        }
    }

    async removePost(req, res, next) {
        try {
            const {postId} = req.body;
            const user = req.user;

            if(!user || !user.id || !postId) 
                return next(ApiError.BadRequest("Вы не авторизованны или данного поста не существует!"));

            const post = await postService.removePost(user.id, postId);
            const postData = new PostDto(post);
    
            return res.json(postData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new PostController();