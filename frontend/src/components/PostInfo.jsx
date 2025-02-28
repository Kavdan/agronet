import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import postStore from "../store/postStore";
import { toJS } from "mobx";
import "./styles/postInfo.css";
import Avatar from "/avatar.webp";
import { CommentItem } from "./CommentItem";
import { PostService } from "../services/postService";
import userStore from "../store/userStore";
import Modal from "./Modal";
import { PhotoService } from "../services/photoService";
import { PhotoCarusel } from "./PhotoCarusel";

export const PostInfo = observer(() => {
  const { id } = useParams();
  const [comment, setComment] = useState("");
  const [showUpdate, setShowUpdate] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [removePerm, setRemovePerm] = useState("");
  const [showPhoto, setShowPhoto] = useState(false);
  const [currPhoto, setCurrPhoto] = useState(0);
  const [file, setFile] = useState(null);
  const addFileRef = useRef(null);

  const nav = useNavigate();

  useEffect(() => {
    postStore.getPostById(id);
  }, []);

  const addComment = async () => {
    await PostService.addComment(id, null, comment);
    setComment("");
    await postStore.getPostById(id);
  };

  const flattenComments = (comments) => {
    if (!comments || comments?.length === 0) return;
    let flatComments = [];

    comments.forEach((comment) => {
      if (comment.parent) flatComments.push(comment); // Добавляем сам комментарий
      if (comment.replies && comment.replies.length > 0) {
        flatComments = flatComments.concat(flattenComments(comment.replies)); // Рекурсивно добавляем вложенные
      }
    });

    return flatComments;
  };

  const setUpdate = () => {
    setTitle(postStore.post?.title);
    setContent(postStore.post?.content);
    setTags(postStore.post?.tags?.join(","));
    setShowUpdate(!showUpdate);
  };

  const handleUpdatePost = async () => {
    await PostService.updatePost(id, title, content, tags);
    await postStore.getPostById(id);
    setShowUpdate(false);
  };

  const handleRemovePost = async () => {
    await PostService.removePost(id);
    setRemovePerm(false);
    nav("/");
  };

  console.log(toJS(postStore.post.photos));

  const handleRemovePhoto = async (i) => {
    await PhotoService.removePhoto(i);
    postStore.getPostById(id);
  };

  const handleAddPhoto = async () => {
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("postId", id);
    try{
        await PhotoService.addPhoto(formData);
    }catch(e){
        console.log(e);
    }
    postStore.getPostById(id);
    setFile('');
  }

  return (
    <div className="post_info">
      {showPhoto && (
        <Modal isOpen={showPhoto} onClose={setShowPhoto}>
          <img
            src={
              postStore.post?.photos[currPhoto]
                ? postStore.post.photos[currPhoto]?.data
                : "#"
            }
            alt=""
            style={{ maxWidth: 800 }}
          />
        </Modal>
      )}

      {showUpdate ? (
        <input
          className="post_info_update_title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Добавьте заголовок ..."
        ></input>
      ) : (
        <h3>{postStore.post?.title}</h3>
      )}

      {showUpdate ? (
        <>
          <textarea
            className="post_info_update_content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Добавьте текст ..."
          ></textarea>
          <PhotoCarusel
            photos={postStore?.post?.photos}
            onRemovePhoto={handleRemovePhoto}
          />
          <div className="addFile">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e?.target?.files[0])}
              ref={addFileRef}
            />
            {!file && 
            <button onClick={() => addFileRef.current && addFileRef.current.click()}>Добавить фото</button>}
            {file && 
              <>
                <span>{file && file.name}</span> 
                <button onClick={() => handleAddPhoto()}>Подтвердить</button>
              
              </>
              }
          </div>
        </>
      ) : (
        <>
          <p className="post_info_content">{postStore?.post?.content}</p>
          <PhotoCarusel photos={postStore?.post?.photos} />
        </>
      )}

      {showUpdate ? (
        <input
          className="post_info_update_tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Добавьте теги ..."
        ></input>
      ) : (
        <p className="post_info_tags">
          {postStore.post?.tags?.map((tag, i) => (
            <span key={i}>#{tag} </span>
          ))}
        </p>
      )}

      {postStore.post?.user_id === userStore.user?.id && (
        <div className="post_info_editors">
          {showUpdate ? (
            <span onClick={() => setUpdate()}>Отменить</span>
          ) : (
            <span onClick={() => setUpdate()}>Изменить</span>
          )}
          {showUpdate ? (
            <span onClick={() => handleUpdatePost()}>Подтвердить</span>
          ) : (
            <span onClick={() => setRemovePerm(!removePerm)}>Удалить</span>
          )}
        </div>
      )}

      {removePerm && (
        <Modal isOpen={removePerm} onClose={setRemovePerm}>
          <div className="remove_perm">
            <h2>Вы точно хотите удалить пост?</h2>
            <div>
              <button onClick={() => handleRemovePost()}>Да</button>
              <button onClick={() => setRemovePerm(false)}>Нет</button>
            </div>
          </div>
        </Modal>
      )}

      {showUpdate || (
        <div className="post_info_comment">
          <textarea
            placeholder="Написать комментарий к посту"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          ></textarea>
          <button onClick={() => addComment()}>Отправить</button>
        </div>
      )}
      <div className="comments">
        {flattenComments(toJS(postStore.post?.comments) || [])
          ?.reverse()
          .map((comment) => {
            return (
              <CommentItem
                key={comment?.parent?.id}
                id={comment?.parent?.id}
                postId={toJS(postStore.post?.id)}
                userId={comment?.parent?.user_id}
                username={comment?.parent?.user?.username}
                content={comment?.parent?.content}
                replies={comment?.replies}
              />
            );
          })}
      </div>
    </div>
  );
});
