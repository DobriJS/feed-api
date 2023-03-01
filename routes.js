const router = require('express').Router();

const authController = require('./controllers/auth.controller');
const postController = require('./controllers/post.controller');

router.use('/auth', authController);
router.use('/', postController);

module.exports = router;
