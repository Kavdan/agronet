import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import postStore from "../store/postStore";
import { PostItem } from "./PostItem";
import "./styles/postsList.css"

export const PostsList = observer(() => {

    useEffect(() => {
        postStore.getPosts();
    }, []);

    return (
        <div className="posts_list">
            {postStore.posts && postStore.posts.map((post) => {
                return <PostItem key={post.id} {...post}/>
            })}
        </div>
    );
})