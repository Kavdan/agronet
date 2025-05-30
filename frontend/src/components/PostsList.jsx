import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import postStore from "../store/postStore";
import { PostItem } from "./PostItem";
import "./styles/postsList.css"
import { useNavigate } from "react-router-dom";

export const PostsList = observer(() => {
    const nav = useNavigate();

    useEffect(() => {
        postStore.setLimit(10);
        postStore.getPosts();
    }, [postStore.currentPage]);

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
            <div className="filters">
                <div className="sort">
                    <span>Сортировать: </span>
                    <select className="sort">
                        <option>По дате</option>
                        <option>По лайкам</option>
                        <option>По кол-ву комментариев</option>
                    </select>
                </div>
                <button onClick={() => nav("/postsMap")}>Открыть карту</button>
            </div>
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