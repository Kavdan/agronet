const Router = require('express').Router;
const router = new Router();
const {body} = require('express-validator');
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/auth-middleware');

router.post("/signup",
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    body('username').isLength({min: 1, max: 20}),
    userController.signup
);

router.post("/signin", 
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.signin
);

router.post("/signout", userController.signout);

router.post("/refresh", userController.refresh);

router.get('/activate/:link', userController.activate);
router.get('/getusers', userController.getUsers)

router.post(
  "/createpost",
  body("title").isLength({ min: 3, max: 200 }),
  body("content").isLength({ min: 2, max: 1000 }),
  authMiddleware,
  postController.createPost
);
router.post(
  "/updatepost",
  body("title").isLength({ min: 3, max: 200 }),
  body("content").isLength({ min: 2, max: 1000 }),
  authMiddleware,
  postController.updatePost
);
router.post(
    "/removepost",
    authMiddleware,
    postController.removePost
);

module.exports = router;