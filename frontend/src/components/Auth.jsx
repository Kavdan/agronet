import { useEffect, useState } from "react";
import "./styles/signin.css";
import userStore from "../store/userStore";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

export const Auth = observer(({ isRegistration }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleSignIn = async () => {
    const res = await userStore.signIn(email, password);
    nav("/ps")
  };

  const handleSignUp = async () => {
    const res = await userStore.signUp(username, email, password);
  };

  return (
    <div className="signin">
      <h2>{isRegistration ? "Регистрация" : "Вход"}</h2>

      {isRegistration && (
        <>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <span>{userStore.errors?.username}</span>
        </>
      )}

      <input
        type="text"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <span>{userStore.errors?.email}</span>

      <input
        type="text"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        <span>{userStore.errors?.password}</span>
        <span>{userStore.errors?.msg}</span>
      {isRegistration ? (
        <button onClick={() => handleSignUp()}>Зарегистрироваться</button>
      ) : (
        <button onClick={() => handleSignIn()}>Войти</button>
      )}
    </div>
  );
});
