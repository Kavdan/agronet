import "./styles/postItem.css";
import { observer } from "mobx-react-lite";
import "./styles/postItem.css";
import { useNavigate } from "react-router-dom";
import postStore from "../store/postStore";
import { toJS } from "mobx";
import { useState } from "react";
import Modal from "./Modal"

export const PostItem = observer(
  ({ id, updatedAt, title, content, tags, likes, comments, photos }) => {
    const date = new Date(updatedAt);
    const nav = useNavigate();
    const [showPhoto, setShowPhoto] = useState(false);
    const [currPhoto, setCurrPhoto] = useState(0);
    
    const handleShowPhoto = (i) => {
        setShowPhoto(!showPhoto);
        setCurrPhoto(i);
    }

    // Получаем день, месяц, год, часы и минуты
    const day = String(date.getUTCDate()).padStart(2, "0"); // День
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Месяц (начинается с 0, поэтому +1)
    const year = date.getUTCFullYear(); // Год
    const hours = String(date.getUTCHours()).padStart(2, "0"); // Часы
    const minutes = String(date.getUTCMinutes()).padStart(2, "0"); // Минуты

    // Форматируем дату в нужный формат
    const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;

    const goToPostInfo = () => {
        nav("/postInfo/" + id);
    }

    return (
      <div className="post_item">
        {showPhoto && <Modal isOpen={showPhoto} onClose={setShowPhoto}>
          <img 
          src={photos[currPhoto] ? photos[currPhoto]?.data : "#"} 
          alt=""
          style={{maxWidth: 800}} />
          </Modal>}
        <div className="post_item_top">
          <i>🗓️ {formattedDate}</i>
          <span>{"🌟" || "⭐"}</span>
        </div>
        <h2 className="post_item_title"
            onClick={() => goToPostInfo()}>{title}</h2>
        <p className="post_item_content">
          {content.length > 50 ? content.slice(0, 100) + " ..." : content}
        </p>
        <div>
          {Array.isArray(photos) && photos?.map((p, i) => {
            return <img style={{height: 100, 
              width: "100px", 
              marginBottom: 10,
              marginRight: 10,
              cursor: "pointer"}} 
              src={p.data || "#"} 
              onClick={() => handleShowPhoto(i)}/>
          })}
        </div>
        <div className="post_item_info">
          <div className="likes">
            <span>👍</span>
            <span>0</span>
          </div>

          <div className="comments">
            <span>💬</span>
            <span>0</span>
          </div>
        </div>
        <div className="post_item_tags">
            {tags.map((tag, i) => <span key={i}>#{tag}</span>)}
        </div>
      </div>
    );
  }
);
