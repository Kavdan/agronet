export class AuthError {
  email;
  password;
  username;
  msg;

  constructor(msg, errors) {
    if (errors && errors.length && errors.length > 0) {
      for (let error of errors) {
        if (error.path === "email") this.email = error.msg;
        if (error.path === "password") this.password = error.msg;
        if (error.path === "username") this.username = error.msg;
      }
    }

    this.msg = msg;
  }
}

