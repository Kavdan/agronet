import Avatar from "/avatar.webp";
import "./styles/commentItem.css";
import { useState } from "react";
import { PostService } from "../services/postService";
import postStore from "../store/postStore";
import { toJS } from "mobx";
import Modal from "./Modal";
import userStore from "../store/userStore";

export const CommentItem = ({
  id,
  postId,
  userId,
  avatar,
  username,
  content,
  replies,
}) => {
  const [showReply, setShowReply] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [comment, setComment] = useState("");
  const [showAvatar, setShowAvatar] = useState(false);
  const [error, setError] = useState('');

  const addComment = async () => {
    if(!userStore.user.id) {
      setError('Авторизируйтесь, чтобы оставлять комментарии!');
      setTimeout(() => {
        setError('');
      }, 3000);
      return;
    }

    await PostService.addComment(postId, id, comment);
    await postStore.getPostById(postId);
    setComment("");
    setShowReply(false);
  };

  const removeComment = async () => {
    await PostService.removeComment(id);
    await postStore.getPostById(postId);
    setComment("");
    setShowReply(false);
  };

  const updateComment = async () => {
    await PostService.updateComment(id, comment);
    await postStore.getPostById(postId);
    setComment('');
    setShowUpdate(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Чтобы Enter не переносил строку
      updateComment();
    }
  };

  const setUpdateComment = () => {
    setComment(content);
    setShowUpdate(((prev) => !prev));
  }

  return (
    <div className="comment">
            <div className="comment_user">
        <img className="avatar"
             src={Avatar} 
             alt=""
             onClick={() => setShowAvatar(!showAvatar)} />
        {!showAvatar || 
        <Modal isOpen={showAvatar} 
                                onClose={setShowAvatar}>
          <img style={{}} src={Avatar} />
        </Modal>}
        <p className="comment_username">{username}</p>
      </div>
      <div className="comment_content"
                style={{ background: userStore.user?.id === userId ? '#748b6f73' : 'transparent',
                         borderColor: userStore.user?.id === userId ? 'brown' : '' 
                 }}>

        {showUpdate ? 
        <div className="comment_content_update">
          <textarea value={comment} 
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e)}
                    className="content"></textarea>
        </div>
        : content}

        <div className="comment_buttons">
          { showUpdate || <button onClick={() => setShowReply(!showReply)}>Ответить</button>}
          { showUpdate || userStore.user?.id === userId && <button onClick={() => removeComment()}>Удалить</button>}
          { userStore.user?.id === userId && <button onClick={() => setUpdateComment()}>{showUpdate ? 'Отменить' : 'Изменить'}</button>}
          <span className="error">{error}</span>
        </div>
      </div>
      {
        <div hidden={!showReply} className="comment_reply">
          <textarea
            placeholder="Напишите ответ ..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
          <button onClick={() => addComment()}>Отправить</button>
        </div>
      }
      <div className="replies"
           style={{borderColor: userStore.user?.id === userId ? 'brown' : ''}}>
        {replies &&
          replies.map((comment) => {
            return (
              <CommentItem
                key={comment?.id}
                id={comment?.id}
                postId={toJS(postStore.post?.id)}
                userId={comment?.user_id}
                username={comment?.user?.username}
                content={comment?.content}
                replies={comment?.replies}
              />
            );
          })}
      </div>
    </div>
  );
};
