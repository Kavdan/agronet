module.exports = class PostDto {
    id;
    user_id;
    title;
    content;

    constructor(model) {
        this.id = model.id;
        this.user_id = model.user_id;
        this.title = model.title;
        this.content = model.content;
    }
}