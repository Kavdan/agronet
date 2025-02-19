export class PostError {
  title = '';
  content = '';
  tags = '';
  msg = '';

  constructor(msg, errors) {
      if (errors && errors.length && errors.length > 0) {
      for (let error of errors) {
          if (error.path === "title") this.title = error.msg;
          if (error.path === "content") this.content = error.msg;
          if (error.path === "tags") this.tags = error.msg;
      }
    }

    this.msg = msg;
  }
}
