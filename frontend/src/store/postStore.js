import { makeAutoObservable, runInAction, toJS } from "mobx";
import { PostError } from "../components/errors/postError";
import { PostService } from "../services/postService";

class PostStore {
    posts = [];
    errors = [];
    post = {};
    searchQuery = '';
    currentPage = 1;
    totalPages = 1;
    totalPosts = 1;
    limit = 3;

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

    setSearchQuery(query) {
        this.searchQuery = query;
    }

    setCurrentPage(page = 1){
        this.currentPage = page;
    }

    setTotalPages(pages = 1){
        this.totalPages = pages;
    }

    setTotalPosts(postsCount){
        this.totalPosts = postsCount;
    }

    setLimit(limit){
        this.limit = limit;
    }

    async createPost(title, content, tags, files, coordinates) {
        try{
            this.setErrors([]);
            const res = await PostService.createPost(title, content, tags, files, coordinates); 
            this.setPosts(res.data);
            return res;
        }catch(e) { 
            console.log(e);
            this.setErrors(new PostError(e.response?.data?.message, 
                e.response?.data?.errors));
        }
    }

    async getPosts() {
        try {
            this.setErrors([]);
            const res = await PostService.getPosts(
                this.searchQuery,
                this.currentPage,
                this.limit
            );

            runInAction(() => {
                this.setPosts(res.data.posts);
                this.setCurrentPage(+(res.data.currentPage));
                this.setTotalPosts(+(res.data.totalPosts));
                this.setTotalPages(+(res.data.totalPages));
            })
        } catch (e) {
            console.log(e);
            this.setErrors(new PostError(e.response?.data?.message, 
                e.response?.data?.errors));
        }
    }

    async getMyPosts() {
        try {
            this.setErrors([]);
            const res = await PostService.getMyPosts(
                this.searchQuery,
                this.currentPage,
                this.limit
            );
            runInAction(() => {
                this.setPosts(res.data.posts);
                this.setCurrentPage(+(res.data.currentPage));
                this.setTotalPosts(+(res.data.totalPosts));
                this.setTotalPages(+(res.data.totalPages));
            })
        } catch (e) {
            console.log(e);
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

    async updatePost(postId, title, content, tags){
        try {
            this.setErrors([]);
            const res = await PostService.updatePost(postId, title, content, tags);
            this.setPost(res.data);
        } catch (error) {
            this.setErrors(new PostError(e.response?.data?.message, 
                e.response?.data?.errors));
        }
    }

    get filteredPosts() {
        if (!Array.isArray(this.posts)) {
            return [];
        }
        return this.posts?.filter(post => true);
    }
}

export default new PostStore();