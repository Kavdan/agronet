import { useEffect, useState } from "react";
import "./App.css";
import { Header } from "./components/Header";
import userStore from "./store/userStore";
import { Route, Routes } from "react-router-dom";
import { CreatePost } from "./components/CreatePost";
import { PostItem } from "./components/PostItem";
import { PostsList } from "./components/PostsList";
import { PostInfo } from "./components/PostInfo";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
      userStore.checkAuth();
  }, []);

  return (
    <>
      <Header />
      <div className="content">
        <Routes>
            <Route path="/createPost" element={<CreatePost />}/>
            <Route path="/ps" element={<PostsList />}/>
            <Route path="/postInfo/:id" element={<PostInfo />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
