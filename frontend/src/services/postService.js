import $api from "../http";

export class PostService {
    static async createPost(title, content, tags) {
        return $api.post("/createpost", {title, content, tags});
    }

    static async getPosts() {
        const res = await $api.get("/getposts");
        return res;
    }

    static async getPostById(id) {
        const res = await $api.get("/getpost", {params: {id}});
        return res;
    }

    static async addComment(postId, parentId, content){
        try {
            const res = await $api.post("/createcomment", {
                postId,
                parentId, 
                content});
            return res;
        }catch (error) {
            console.log(error);
        }   
    }

    static async removeComment(commentId) {
        try {
            const res = await $api.post("/removecomment", {commentId});
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    static async updateComment(commentId, content) {
        try {
            const res = await $api.post("/updatecomment", {commentId, content});
            return res;
        } catch (error) {
            console.log(error);
        }
    }
}
