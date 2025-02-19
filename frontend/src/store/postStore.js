import { makeAutoObservable, toJS } from "mobx";
import { PostError } from "../components/errors/postError";
import { PostService } from "../services/postService";

class PostStore {
    posts = [];
    errors = [];
    post = {};

    constructor() {
        makeAutoObservable(this);
    }

    setPosts(posts) {
        this.posts = posts;
    }

    setPost(post){
        this.post = post;
    }

    setErrors(errors) {
        this.errors = errors;
    }

    async createPost(title, content, tags) {
        try{
            this.setErrors([]);
            const res = await PostService.createPost(title, content, tags); 
            this.setPosts(res.data);
            return res;
        }catch(e) { 
            this.setErrors(new PostError(e.response?.data?.message, 
                e.response?.data?.errors));
        }
    }

    async getPosts() {
        try {
            this.setErrors([]);
            const res = await PostService.getPosts();
            console.log(res.data);
            this.setPosts(res.data);
        } catch (e) {
            this.setErrors(new PostError(e.response?.data?.message, 
                e.response?.data?.errors));
        }
    }

    async getPostById(id) {
        try {
            const post = await PostService.getPostById(id);
            this.setPost(post.data);
        } catch (e) {
            this.setErrors(new PostError(e.response?.data?.message, 
                e.response?.data?.errors));
        }
    }
}

export default new PostStore();