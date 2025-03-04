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
            let {title, content, tags, coordinates} = req.body;

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

            
            const post = await postService.createPost(user.id, title, content, tags, coordinates);

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

    async getPosts(req, res, next) {
        try {
            const { query, page, limit } = req.query;
             const posts = await postService.getAllPosts(
                query || '',
                page || 1,
                limit || 2
            );
            return res.json(posts);
        } catch (e) {
            next(e);
        }
    }

    async getPostById(req, res, next) {
        try {
            const { id } = req.query;
            if(!id) return next(ApiError.BadRequest("Неккоректный id!"));

            const post = await postService.getPostById(id);
            return res.json(post);
        } catch (e) {
            next(e);
        }
    }

    async getMyPosts(req, res, next) {
        try {
            const { query, page, limit } = req.query;
            const user = req.user;
            if(!user) next(ApiError.UnauthorizedError());

             const posts = await postService.getMyPosts(
                query || '',
                page || 1,
                limit || 2,
                user.id
            );

            console.log(">>>>>>>>>>>>>>>", posts);
            return res.json(posts);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new PostController();