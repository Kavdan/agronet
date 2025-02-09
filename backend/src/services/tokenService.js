const jwt = require('jsonwebtoken');
const tokenModel = require('../models/tokenModel');
const db = require('../database');
const { where } = require('sequelize');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15s'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30s'})
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken, _transaction) {
        const transaction = _transaction || await db.transaction({autocommit: false})        

        try{
            const tokenData = await tokenModel.findOne({
                where:{
                    user_id: userId
                },
                transaction
            });
            if (tokenData) {
                tokenData.refresh_token = refreshToken;
                return tokenData.save(
                    {transaction}
                );
            }
            const token = await tokenModel.create({user_id: userId, refresh_token: refreshToken}, {
                transaction
            });

            if(!transaction) transaction.commit();
            return token;
        } catch(e) {
            if(!transaction) transaction.rollback();
            throw e;
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async removeToken(refreshToken, transaction) {
        const tokenData = await tokenModel.destroy({
            where: { refresh_token: refreshToken},
            transaction
        })
        return tokenData;
    }

    async findToken(refreshToken, transaction) {
        const tokenData = await tokenModel.findOne({
            where: {
                refresh_token: refreshToken
            },
            transaction
        })
        return tokenData;
    }
}

module.exports = new TokenService();