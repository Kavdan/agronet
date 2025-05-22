import { makeAutoObservable, runInAction } from "mobx";
import UserService from "../services/userService";
import { AuthError } from "../components/errors/authError";

class UserStore {
  user = {};
  errors;
  isAuth;
  isLoading;

  setUser(user) {
    this.user = user;
  }

  setAuth(isAuth) {
    this.isAuth = isAuth;
  }

  setErrors(errors) {
    this.errors = errors;
  }

  setLoading(isLoading) {
    this.isLoading = isLoading;
  }

  constructor() {
    makeAutoObservable(this);
  }

  async signUp(username, email, password) {
    try {
        const response = await UserService.signUp(username, email, password);
        localStorage.setItem("token", response.data.accessToken);
        this.setUser(response.data.user);
        this.setLoading(false);
        this.setAuth(true);
    } catch (e) {
        this.setErrors(new AuthError(e.response?.data?.message, e.response?.data?.errors));
        console.log(e);
    }
  }

  async signIn(email, password) {
    try {
        const response = await UserService.signIn(email, password);
        localStorage.setItem("token", response.data.accessToken);
        this.setUser(response.data.user);
        this.setAuth(true);
    } catch (e) {
        this.setErrors(new AuthError(e.response?.data?.message, e.response?.data?.errors));
        console.log(e);
    }
  }

  async signOut() {
    try {
        const response = await UserService.signOut();
        localStorage.removeItem('token');
        this.setAuth(false);
        this.setUser({});
    } catch (e) {
        this.setErrors(new AuthError(e.response?.data?.message, e.response?.data?.errors));
        console.log(e);
    }
  }

  async checkAuth() {
    this.setLoading(true);
    try {
          if(!localStorage.getItem('token')) throw new Error("Войдите в аккаунт!");
          const response = await UserService.refresh();
          localStorage.setItem('token', response.data.accessToken);
          this.setAuth(true);
          this.setUser(response.data.user);
          this.setErrors([]);
    } catch (e) {
        this.setAuth(false);
        this.setErrors(new AuthError(e.response?.data?.message, e.response?.data?.errors));
        console.log(e);
    } finally {
        this.setLoading(false);
    }

  }

  async updateNotification(id) {
    try {
        const response = await UserService.updateNotification(id);
        this.checkAuth();
    } catch (e) {
        this.setErrors(new AuthError(e.response?.data?.message, e.response?.data?.errors));
        console.log(e);
    }
  }
}

export default new UserStore();