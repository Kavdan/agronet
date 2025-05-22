const commentModel = require("./commentModel");
const emailVerificationModel = require("./emailVerificationModel");
const LikeModel = require("./likeModels");
const PhotoModel = require("./photoModel");
const postModel = require("./postModel");
const postTagModel = require("./postTagModel");
const roleModel = require("./roleModel");
const tagModel = require("./tagModel");
const refreshTokenModel = require("./tokenModel");
const userModel = require("./userModel");

const notificationModel = require("./notificationModel");


userModel.hasOne(refreshTokenModel, {
  foreignKey: "user_id",
});
refreshTokenModel.belongsTo(userModel, { foreignKey: "user_id" });

roleModel.hasMany(userModel, {
  foreignKey: "role_id",
});
userModel.belongsTo(roleModel, {
  foreignKey: "role_id",
});

userModel.hasMany(emailVerificationModel, {
  foreignKey: "user_id",
});
emailVerificationModel.belongsTo(userModel, {
  foreignKey: "user_id",
});

postModel.belongsTo(userModel, { foreignKey: "user_id", onDelete: "CASCADE" });
userModel.hasMany(postModel, { foreignKey: "user_id" });

commentModel.belongsTo(userModel, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
commentModel.belongsTo(postModel, {
  foreignKey: "post_id",
  onDelete: "CASCADE",
});
commentModel.hasMany(commentModel, { as: "Replies", foreignKey: "parent_id" });

postModel.belongsToMany(tagModel, {
  through: postTagModel,
  foreignKey: "post_id",
  otherKey: "tag_id",
  onDelete: "CASCADE"
});

tagModel.belongsToMany(postModel, {
  through: postTagModel,
  foreignKey: "tag_id",
  otherKey: "post_id",
  onDelete: "CASCADE"
});

postModel.hasMany(LikeModel, 
    { foreignKey: "post_id", 
      onDelete: "CASCADE" });

LikeModel.belongsTo(postModel, { foreignKey: "post_id" });

postTagModel.belongsTo(tagModel, { foreignKey: "tag_id" });
postTagModel.belongsTo(postModel, { foreignKey: "post_id" });

tagModel.hasMany(postTagModel, { foreignKey: "tag_id" });

postModel.hasMany(PhotoModel, {foreignKey: "postId", onDelete: "CASCADE"});
PhotoModel.belongsTo(postModel, {foreignKey: "postId", onDelete: "CASCADE"});

commentModel.hasMany(PhotoModel, {foreignKey: "commentId", onDelete: "CASCADE"});
PhotoModel.belongsTo(commentModel, {foreignKey: "commentId", onDelete: "CASCADE"});

userModel.hasMany(notificationModel, { foreignKey: "user_id", onDelete: "CASCADE" });
notificationModel.belongsTo(userModel, { foreignKey: "user_id" });


module.exports = {
  userModel,
  roleModel,
  refreshTokenModel,
};
