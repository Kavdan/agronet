const ApiError = require("../exceptions/api-error");
const photoService = require("../services/photoService");
const postService = require("../services/postService");

class PhotoController {
    async addPhoto(req, res, next) {
        try {
            const { description, postId, commentId } = req.body;
            const file = req.file;

            if(!req.user) return next(ApiError.UnauthorizedError);
    
            if (!file) {
                return next(ApiError.BadRequest("Такого файла нет!"));
            }
            
            const photo = await photoService.addPhoto(description, 
                req.user.id, 
                file, 
                postId, 
                commentId);

            res.json(photo);
        } catch (e) {
            next(e)
        }
    }

    async updatePhoto(req, res, next){
        try {
            const { id } = req.params;
            const { description, postId, commentId } = req.body;
            const file = req.file;

            if(!req.user) return next(ApiError.UnauthorizedError);
            if(!id || !file)
                return next(ApiError.BadRequest("Photo update failed!"))

            const photo = await photoService.updatePhoto(id, 
                description,
                postId,
                file,
                req.user.id,
                commentId);
    
            res.json(photo);
        } catch (e) {
            next(e);
        }
    }

    async removePhoto(req, res, next){
        try {
            const { id } = req.body;
            if(!req.user) return next(ApiError.UnauthorizedError);

            const photo = await photoService.removePhoto(id, 
                req.user.id);

            res.json(photo);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new PhotoController();