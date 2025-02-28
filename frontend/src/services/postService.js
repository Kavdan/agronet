import $api from "../http";
import { PhotoService } from "./photoService";

export class PostService {
    static async createPost(title, content, tags, files) {
        const post = await $api.post("/createpost", {title, content, tags, files});
        
        if(Array.isArray(files) && files.length > 0){
            files.forEach(async (file) => {
                const formData = new FormData();
                formData.append("photo", file);
                formData.append("postId", post.data.id);
                try{
                    await PhotoService.addPhoto(formData);
                }catch(e){
                    console.log(e);
                }
            })
        }

        return post;
    }

    static async getPosts(query, page, limit) {
        const res = await $api.get("/getposts", {params: {query, page, limit}});
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

    static async updatePost(postId, title, content, tags) {
            const res = await $api.post("/updatepost", 
                {postId, title, content, tags});
            return res;
    }

    static async removePost(postId){
        try {
            const res = await $api.post("/removepost", {postId});
            return res;
        } catch (error) {
            console.log(error);
        }
    }
}
