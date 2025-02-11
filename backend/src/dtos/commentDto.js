module.exports = class CommentDto {
    id;
    userId;
    postId;
    parentId;
    content;

    constructor(model) {
        this.id = model.id
        this.userId = model.user_id;
        this.postId = model.post_id;
        this.parentId = model.parent_id;
        this.content = model.content;
    }
}
