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
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });
  const nav = useNavigate();

  const getCoordinates = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          });
        },
        (error) => {
          setCoordinates({
            latitude: null,
            longitude: null,
            error: error.message,
          });
        }
      );
    } else {
      setCoordinates({
        latitude: null,
        longitude: null,
        error: 'Geolocation is not supported by this browser.',
      });
    }
  }

  const postHandle = async () => {
    const res = await postStore.createPost(title, content, tags, files,
      coordinates
    );

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
        onChange={(e) => setFiles([...files, e.target.files[0]])}
      />

      <button className="coordinates"
              onClick={() => getCoordinates()}>Добавить координаты</button>

      <button onClick={() => postHandle()}>Создать пост</button>
    </div>
  );
});
