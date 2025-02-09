const emailVerificationModel = require("./emailVerificationModel");
const roleModel = require("./roleModel");
const refreshTokenModel = require("./tokenModel");
const userModel = require("./userModel");

userModel.hasOne(refreshTokenModel, {
    foreignKey: 'user_id'
});
refreshTokenModel.belongsTo(userModel, { foreignKey: 'user_id' });

roleModel.hasMany(userModel, {
    foreignKey: "role_id"
})
userModel.belongsTo(roleModel, {
    foreignKey: "role_id"
})

userModel.hasMany(emailVerificationModel, {
    foreignKey: "user_id"
})
emailVerificationModel.belongsTo(userModel, {
    foreignKey: "user_id"
})

module.exports = {
    userModel,
    roleModel,
    refreshTokenModel
}

