import $api from "../http";

export default class UserService {
  static async signUp(username, email, password) {
    return await $api.post("/signup", {username, email, password});
  }

  static async signIn(email, password) {
    return await $api.post("/signin", {email, password});
  }

  static async signOut() {
    return await $api.post("/signout");
  }

  static async refresh() {
    const res = await $api.get("/refresh", {withCredentials: true});
    return res;
  }

  static async updateNotification(id) {
    const res = await $api.post("/updatenotification", 
      {id});
    return res;
  }
}
