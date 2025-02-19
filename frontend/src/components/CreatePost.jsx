import { useState } from "react";
import './styles/createPost.css'
import { observer } from "mobx-react-lite";
import postStore from "../store/postStore";
import { useNavigate } from "react-router-dom";

export const CreatePost = observer(() => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const nav = useNavigate();

    const postHandle = async () => {
        const res = await postStore.createPost(title, content, tags);
        
        if(res && res.status === 200) nav("/");
    } 
    
    return (
        <div className="create_post">
            <input type="text" 
                   className="title" 
                   placeholder="Заголовок..."
                   value={title}
                   onChange={(e) => setTitle(e.target.value)}/>

            <span className="error">{postStore.errors?.title}</span>
        
            <textarea placeholder="Напишите что нибудь ..." 
                      className="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}>
            </textarea>

            <span className="error">{postStore.errors?.content}</span>

            <input type="text" 
                   className="tags" 
                   placeholder="теги через запятую, вместо пробелов '_'" 
                   value={tags}
                   onChange={(e) => setTags(e.target.value)}/>

    <span className="error">{postStore.errors?.tags}</span>
            
            <button onClick={() => postHandle()}>Создать пост</button>
        </div>
    );
});