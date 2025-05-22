const db = require("../database");
const UserDto = require("../dtos/userDto");
const emailVerificationModel = require("../models/emailVerificationModel");
const userModel = require("../models/userModel");
const mailService = require("./mailService");
const tokenService = require("./tokenService");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const ApiError = require("../exceptions/api-error");
const notificationModel = require("../models/notificationModel");

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
      const emailStatus = await emailVerificationModel.create(
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
      return { ...tokens, user: { ...userDto, isActivated: emailStatus.status,

        notifications: [],
        notificationCount: 0,
      },  
    };
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
        include: {model: emailVerificationModel, as: "email_verifications"}, 
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

      console.log("SignIN >>>>>>>>>>> : ", userDto, tokens.refreshToken);

      await tokenService.saveToken(
        userDto.id,
        tokens.refreshToken,
        transaction
      );

      const notifications = await notificationModel.findAll({
        where: { user_id: userDto.id },
        order: [['createdAt', 'DESC']],
        transaction,
      });

      await transaction.commit();
      return { ...tokens, 
        user: { ...userDto, isActivated: user.email_verifications[0]?.status,
          notifications,
          notificationCount: notifications.length,

        },
      };
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }

  async signout(refreshToken) {
    const transaction = await db.transaction({ autocommit: false });
    try {
      const token = await tokenService.removeToken(refreshToken, transaction);
      await transaction.commit();
      return token;
    } catch (e) {
      await transaction.rollback();
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
    try{
      if (!refreshToken) {
        throw ApiError.UnauthorizedError();
      }

      const userData = tokenService.validateRefreshToken(refreshToken);
      const tokenFromDb = await tokenService.findToken(refreshToken, transaction);
      
        if (!userData || !tokenFromDb) { //!tokenFromDb
          throw ApiError.UnauthorizedError();
        }

        const user = await userModel.findOne({
            where: {id: userData.id},
            include: {model: emailVerificationModel, as: "email_verifications"}, 
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

        const notifications = await notificationModel.findAll({
          where: { user_id: userDto.id },
          order: [["createdAt", "DESC"]],
          transaction,
        });
        console.log(">>>>> " + notifications);


    const totalNotifications = notifications.length;

        await transaction.commit();
        return {
          ...tokens,
          user: {
            ...userDto,
            isActivated: user.email_verifications[0]?.status,
            notifications,
            notificationCount: totalNotifications,
          },
        };
      }catch(e) {
        await transaction.rollback();
        throw e;
      }
  }

  async getUsers() {
    const users = await userModel.findAll();
    if(!users) throw ApiError.BadRequest("Ошибка в getusers()")
    return users;
  }

  async updateNotification(id) {
    console.log("*********", id, typeof id);
    const existing = await notificationModel.findOne({ where: { id: Number(id) } });
console.log("FOUND:", existing);
    const notification = 
      await notificationModel.update({is_read: true}, {where: {id}});
    return notification;
  }
}

module.exports = new UserService();
