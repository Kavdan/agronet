import "./styles/postItem.css";
import { observer } from "mobx-react-lite";
import "./styles/postItem.css";
import { useNavigate } from "react-router-dom";
import postStore from "../store/postStore";

export const PostItem = observer(
  ({ id, updatedAt, title, content, tags, likes, comments }) => {
    const date = new Date(updatedAt);
    const nav = useNavigate();

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
        <div className="post_item_top">
          <i>🗓️ {formattedDate}</i>
          <span>{"🌟" || "⭐"}</span>
        </div>
        <h2 className="post_item_title"
            onClick={() => goToPostInfo()}>{title}</h2>
        <p className="post_item_content">
          {content.length > 50 ? content.slice(0, 100) + " ..." : content}
        </p>
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
