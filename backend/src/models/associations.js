const commentModel = require("./commentModel");
const emailVerificationModel = require("./emailVerificationModel");
const postModel = require("./postModel");
const postTagModel = require("./postTagModel");
const roleModel = require("./roleModel");
const tagModel = require("./tagModel");
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

postModel.belongsTo(userModel, { foreignKey: "user_id", onDelete: "CASCADE" });
userModel.hasMany(postModel, { foreignKey: "user_id" });

commentModel.belongsTo(userModel, { foreignKey: "user_id", onDelete: "CASCADE" });
commentModel.belongsTo(postModel, { foreignKey: "post_id", onDelete: "CASCADE" });
commentModel.hasMany(commentModel, { as: "Replies", foreignKey: "parent_id" });

postModel.belongsToMany(tagModel, {
    through: postTagModel,
    foreignKey: "post_id", 
    otherKey: "tag_id",    
  });
  
  tagModel.belongsToMany(postModel, {
    through: postTagModel,
    foreignKey: "tag_id", 
    otherKey: "post_id",   
  });

module.exports = {
    userModel,
    roleModel,
    refreshTokenModel
}

