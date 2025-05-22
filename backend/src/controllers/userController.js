const userService = require('../services/userService');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');

class UserController {
    async signup(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }

            const {email, password, username} = req.body;
            const userData = await userService.signup(email, password, username);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async signin(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }

            const {email, password} = req.body;
            const userData = await userService.signin(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async signout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;

            if (!refreshToken) {
                return next(ApiError.BadRequest('Вы не в системе!', errors.array()))
            }

            const token = await userService.signout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            const user = await userService.activate(activationLink);
            return res.send(`<h3> ${user.username} ваш аккаунт был активированн!</h3>
                             <a href="${process.env.API_URL}"> Нажмите, чтобы перейти на главную страницу сайта</a>`);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;

            if (!refreshToken) {
                return next(ApiError.UnauthorizedError())
            }

            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getUsers();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async updateNotification(req, res, next) {
        try {
            const {id} = req.body;
            const notification = await userService.updateNotification(id);
            return res.json(notification);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();