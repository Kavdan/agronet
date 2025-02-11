const db = require("../database");
const UserDto = require("../dtos/userDto");
const emailVerificationModel = require("../models/emailVerificationModel");
const userModel = require("../models/userModel");
const mailService = require("./mailService");
const tokenService = require("./tokenService");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const { where } = require("sequelize");
const ApiError = require("../exceptions/api-error");

class UserService {
  async signup(email, password, username) {
    const transaction = await db.transaction({ autocommit: false });

    try {
      const candidate = await userModel.findOne({
        where: { email },
        transaction,
      });
      if (candidate) {
        throw ApiError.BadRequest(
          `Пользователь с почтовым адресом ${email} уже существует`
        );
      }

      const userId = uuid.v4();
      const activationLink = uuid.v4();
      const hashPassword = await bcrypt.hash(password, 10);

      const user = await userModel.create(
        { id: userId, email, password_hash: hashPassword, username },
        { transaction }
      );
      await emailVerificationModel.create(
        { user_id: userId, activation_link: activationLink },
        { transaction }
      );

      const userDto = new UserDto(user); // id, email, isActivated
      const tokens = tokenService.generateTokens({ ...userDto });
      await tokenService.saveToken(
        userDto.id,
        tokens.refreshToken,
        transaction
      );

      await mailService.sendActivationMail(
        email,
        `${process.env.API_URL}/api/activate/${activationLink}`
      );

      transaction.commit();
      return { ...tokens, user: userDto };
    } catch (e) {
      transaction.rollback();
      throw e;
    }
  }

  async signin(email, password) {
    const transaction = await db.transaction({ autocommit: false });

    try {
      const user = await userModel.findOne({
        where: { email },
        transaction,
      });
      if (!user) {
        throw ApiError.BadRequest(
          `Пользователь с почтовым адресом ${email} не существует`
        );
      }

      const isPassEquals = await bcrypt.compare(password, user.password_hash);
      if (!isPassEquals) {
        throw ApiError.BadRequest("Неверный пароль");
      }

      const userDto = new UserDto(user);
      const tokens = tokenService.generateTokens({ ...userDto });

      await tokenService.saveToken(
        userDto.id,
        tokens.refreshToken,
        transaction
      );

      transaction.commit();
      return { ...tokens, user: userDto };
    } catch (e) {
      transaction.rollback();
      throw e;
    }
  }

  async signout(refreshToken) {
    const transaction = await db.transaction({ autocommit: false });
    try {
      const token = await tokenService.removeToken(refreshToken, transaction);
      transaction.commit();
      return token;
    } catch (e) {
      transaction.rollback();
      throw e;
    }
  }

  async activate(activationLink) {
    const transaction = await db.transaction({ autocommit: false });
    try {
      const emailVerificationRecord = await emailVerificationModel.findOne({
        where: {
          activation_link: activationLink,
        },
      });

      const user = await userModel.findOne({
        where: { id: emailVerificationRecord.user_id },
        transaction,
      });

      if (!emailVerificationModel || !user) {
        throw ApiError.BadRequest("Неккоректная ссылка активации");
      }

      emailVerificationRecord.status = true;
      await emailVerificationRecord.save();

      transaction.commit();
      return user;
    } catch (e) {
      transaction.rollback();
      throw e;
    }
  }

  async refresh(refreshToken) {
    const transaction = await db.transaction({autocommit: false});

    try {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken, transaction);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await userModel.findOne({
            where: {id: userData.id},
            transaction
        });
    
        if(!user) throw ApiError.BadRequest("Некорректный токен!");
    
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
    
        await tokenService.saveToken(
            userDto.id,
            tokens.refreshToken,
            transaction
        );

        transaction.commit();
        return {...tokens, user: userDto}
    } catch (e) {
        transaction.rollback();
        throw e;
    }
  }

  async getUsers() {
    const users = await userModel.findAll();
    if(!users) throw ApiError.BadRequest("Ошибка в getusers()")
    return users;
  }
}

module.exports = new UserService();
