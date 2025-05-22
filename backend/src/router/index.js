const Router = require("express").Router;
const router = new Router();
const { body } = require("express-validator");
const userController = require("../controllers/userController");
const postController = require("../controllers/postController");
const authMiddleware = require("../middlewares/auth-middleware");
const commentModel = require("../models/commentModel");
const commentController = require("../controllers/commentController");
const upload = require("../config/multer");
const photoController = require("../controllers/photoController");

router.post(
  "/signup",
  body("email").isEmail().withMessage("Ведите корректный email!"),
  body("password")
    .isLength({ min: 8, max: 32 })
    .withMessage("Пароль должен соддержать минимум 8 символов!"),
  body("username")
    .isLength({ min: 1, max: 20 })
    .withMessage("Ведите корректное имя пользователя!"),
  userController.signup
);

router.post(
  "/signin",
  body("email").isEmail().withMessage("Ведите корректный email!"),
  body("password")
    .isLength({ min: 8, max: 32 })
    .withMessage("Пароль должен соддержать минимум 8 символов!"),
  userController.signin
);

router.post("/signout", userController.signout);

router.get("/refresh", userController.refresh);

router.get("/activate/:link", userController.activate);
router.get("/getusers", userController.getUsers);

router.post(
  "/createpost",
  body("title")
    .isLength({ min: 3, max: 200 })
    .withMessage("Длинна заголовка должна быть больше 3 символов!"),
  body("content")
    .isLength({ min: 2, max: 1000 })
    .withMessage("Длинна текста должна быть больше 3 символов!"),
  body("tags")
    .matches(/^[a-zа-яА-ЯA-Z0-9_]+$/)
    .withMessage(
      "Теги не должны включать инные символы кроме цифр и букв (русские и англ)!"
    ),
  authMiddleware,
  postController.createPost
);
router.post(
  "/updatepost",
  body("title").isLength({ min: 3, max: 200 }),
  body("content").isLength({ min: 2, max: 2000 }),
  authMiddleware,
  postController.updatePost
);
router.post("/removepost", authMiddleware, postController.removePost);

router.post(
  "/createcomment",
  body("content").isLength({ min: 2, max: 1000 }),
  authMiddleware,
  commentController.createComment
);

router.post(
  "/updatecomment",
  body("content").isLength({ min: 2, max: 1000 }),
  authMiddleware,
  commentController.updateComment
);

router.post("/removecomment", authMiddleware, commentController.removeComment);
router.get("/getposts", postController.getPosts);
router.get("/getpost", postController.getPostById);
router.get("/getmyposts", authMiddleware, postController.getMyPosts);
router.post("/getpostcomments", commentController.getAllByPostId);

router.post(
  "/addphoto",
  authMiddleware,
  upload.single("photo"),
  photoController.addPhoto
);
router.post(
  "/updatephoto",
  authMiddleware,
  upload.single("photo"),
  photoController.updatePhoto
);
router.post("/removephoto", authMiddleware, photoController.removePhoto);

router.post("/updatenotification", 
  authMiddleware, userController.updateNotification);

module.exports = router;
