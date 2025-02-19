import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import postStore from "../store/postStore";
import { toJS } from "mobx";
import "./styles/postInfo.css";
import Avatar from "/avatar.webp"
import { CommentItem } from "./CommentItem";
import { PostService } from "../services/postService";

export const PostInfo = observer(() => {
    const { id } = useParams();
    const [comment, setComment] = useState('');
    
    useEffect(() => {
        postStore.getPostById(id);
    }, [])

    const addComment = async () => {
        await PostService.addComment(id, null, comment);
        setComment('');
        await postStore.getPostById(id);
    }

    const flattenComments = (comments) => {
        if(!comments || comments?.length === 0) return;
        let flatComments = [];
    
        comments.forEach(comment => {
            if(comment.parent) flatComments.push(comment); // Добавляем сам комментарий
            if (comment.replies && comment.replies.length > 0) {
                flatComments = flatComments.concat(flattenComments(comment.replies)); // Рекурсивно добавляем вложенные
            }
        });

        return flatComments;
    };



    return (
        <div className="post_info">
            <h3>{postStore.post?.title}</h3>
            <p className="post_info_content">{postStore.post?.content}</p>
            <p className="post_info_tags">
                {postStore.post?.tags?.map((tag, i) => 
                  <span key={i}>#{tag} </span>)}
            </p>
            <div className="post_info_comment">
                <textarea placeholder="Написать комментарий к посту"
                          onChange={(e) => setComment(e.target.value)}
                          value={comment}></textarea>
                <button onClick={() => addComment()}>Отправить</button>
            </div>
            <div className="comments">
               {flattenComments(toJS(postStore.post?.comments) || [])?.reverse().map((comment) => {
                    return <CommentItem 
                                key={comment?.parent?.id}
                                id={comment?.parent?.id}
                                postId={toJS(postStore.post?.id)}
                                userId={comment?.parent?.user_id}
                                username={comment?.parent?.user?.username}
                                content={comment?.parent?.content}
                                replies={comment?.replies}/>
               })}
            </div>
        </div>
    )
})