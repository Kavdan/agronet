import { useEffect, useState } from "react";
import "./App.css";
import { Header } from "./components/Header";
import userStore from "./store/userStore";
import { Route, Routes } from "react-router-dom";
import { CreatePost } from "./components/CreatePost";
import { PostItem } from "./components/PostItem";
import { PostsList } from "./components/PostsList";
import { PostInfo } from "./components/PostInfo";
import { MyPostsList } from "./components/MyPostsList";
import { MapMarker } from "./components/MapMarker";

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
            <Route path="/" element={<PostsList />}/>
            <Route path="/myposts" element={<MyPostsList />}/>
            <Route path="/createPost" element={<CreatePost />}/>
            <Route path="/postInfo/:id" element={<PostInfo />} />
            <Route path="/postsMap" element={<MapMarker />} />
            <Route path="/postMap/:longitude/:latitude" element={<MapMarker />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
