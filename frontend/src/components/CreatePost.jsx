import { useRef, useState } from "react";
import "./styles/createPost.css";
import { observer } from "mobx-react-lite";
import postStore from "../store/postStore";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { PhotoCarusel } from "./PhotoCarusel";

export const CreatePost = observer(() => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [files, setFiles] = useState([]);
  const nav = useNavigate();


  const postHandle = async () => {
    const res = await postStore.createPost(title, content, tags, files);

    if (res && res.status === 200) nav("/");
  };

  const removePhoto = (index) => {
    setFiles(files.filter((file, i) => i !== index));
  }


  return (
    <div className="create_post">
     
      <input
        type="text"
        className="title"
        placeholder="Заголовок..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <span className="error">{postStore.errors?.title}</span>

      <textarea
        placeholder="Напишите что нибудь ..."
        className="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>

      <span className="error">{postStore.errors?.content}</span>

      <input
        type="text"
        className="tags"
        placeholder="теги через запятую, вместо пробелов '_'"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <span className="error">{postStore.errors?.tags}</span>

      <PhotoCarusel photos={files} onRemovePhoto={removePhoto}/>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFiles([...files, ...e.target.files])}
      />

      <button onClick={() => postHandle()}>Создать пост</button>
    </div>
  );
});
