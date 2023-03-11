const router = require('express').Router();
const { requiresAuth } = require('./middlewares/auth.middleware');

const authController = require('./controllers/auth.controller');
const postController = require('./controllers/post.controller');
const userController = require('./controllers/user.controller');

router.use('/auth', authController);
router.use('/user', requiresAuth, userController);
router.use('/', postController);

module.exports = router;
