import "./styles/header.css";
import Logo from "/logo.svg";
import Lupa from "/lupa.svg";
import Avatar from "/avatar.webp";
import Modal from "./Modal";
import { use, useEffect, useRef, useState } from "react";
import { Auth } from "./Auth";
import userStore from "../store/userStore";
import { observer } from "mobx-react-lite";
import { Link, useNavigate } from "react-router-dom";
import postStore from "../store/postStore";

export const Header = observer(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegistration, setIsRegistration] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [query, setQuery] = useState('');

  const menuRef = useRef(null);
  const nav = useNavigate();

  const openSignInModal = () => {
    setIsOpen(true);
    setIsRegistration(false);
  };

  const openSignUpModal = () => {
    setIsOpen(true);
    setIsRegistration(true);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpenMenu(false);
    }
  };


  useEffect(() => {
    document.addEventListener('mousedown', 
      (e) => handleClickOutside(e));
    return () => {
      document.removeEventListener('mousedown', 
        (e) => handleClickOutside(e)); // Удалить обработчик при размонтировании
    };
  }, []);

  const handleSearchChange = async () => {
    postStore.setSearchQuery(query);
    await postStore.getPosts();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Чтобы Enter не переносил строку
      handleSearchChange();
    }
  };

  return (
    <div className="header">
      <img src={Logo} onClick={() => nav('/')} className="logo" alt="" />

      <div className="header-search">
        <input type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e)}/>
        <img src={Lupa} />
      </div>

      {userStore.isAuth ? (
        <div className="header-profile">
          <div className="header-profile-menu" ref={menuRef}  hidden={!isOpenMenu}>
            <div className="header-profile-menu-item">
                Уведомления
            </div>
            <div className="header-profile-menu-item">
              <Link to={"/createPost"}>
                Создать пост
              </Link>
            </div>
            <div className="header-profile-menu-item">Мои посты</div>
            <div className="header-profile-menu-button">
              <button onClick={() => userStore.signOut()}>Выйти</button>
            </div>
          </div>
          <p className="header-profile-name">{userStore.user?.username}</p>
          <div className="header-profile-img" onClick={() => setIsOpenMenu(!isOpenMenu)}>
            <img src={Avatar} alt="" />
          </div>
        </div>
      ) : (
        <div className="header-auth-buttons">
          <button onClick={() => openSignInModal()}>Вход</button>
          <button onClick={() => openSignUpModal()}>Регистрация</button>
          <Modal isOpen={isOpen} onClose={setIsOpen}>
            <Auth isRegistration={isRegistration} />
          </Modal>
        </div>
      )}
    </div>
  );
});
