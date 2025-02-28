import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import postStore from "../store/postStore";
import { PostItem } from "./PostItem";
import "./styles/postsList.css"

export const PostsList = observer(() => {

    useEffect(() => {
        postStore.getPosts();
    }, []);

    const handleNextPage = () => {
        if(postStore.currentPage >= postStore.totalPages) 
            return;
        postStore.setCurrentPage(postStore.currentPage + 1);
        postStore.getPosts();
    }

    const handlePrevPage = () => {
        if(postStore.currentPage === 1) 
            return;
        postStore.setCurrentPage(postStore.currentPage - 1);
        postStore.getPosts();
    }

    return (
        <div className="posts_list">
            {/* {postStore.posts && postStore.posts.map((post) => {
                return <PostItem key={post.id} {...post}/>
            })} */}
            {postStore.filteredPosts.map((post) => {
                return <PostItem key={post.id} {...post}/>
            })}
            <div className="pagination">
                <span onClick={() => handlePrevPage()}>{'<'}</span>
                <span>{postStore.currentPage}</span>
                <span onClick={() => handleNextPage()}>{'>'}</span>
            </div>
        </div>
    );
})