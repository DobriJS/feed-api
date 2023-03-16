const router = require('express').Router();
const postService = require('../services/post.service');
const { requiresAuth } = require('../middlewares/auth.middleware');
const createHttpError = require('http-errors');

router.get('/', async (req, res, next) => {
  try {
    const posts = await postService.getAll();
    if (!posts) throw createHttpError(500);

    return res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
});

router.post('/create-post', requiresAuth, async (req, res, next) => {
  const { title, body, image } = req.body;

  try {
    if (!title || !body || !image) throw createHttpError(400, 'Plase add all the fields');

    const post = await postService.create({
      title,
      body,
      image,
      postedBy: req.user
    });

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
});

router.put('/comment', requiresAuth, async (req, res, next) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id
  };

  const postId = req.body.postId;

  try {
    if (!postId) throw createHttpError(400);
    const newPost = await postService.makeComment(postId, comment);

    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
});

router.put('/like', requiresAuth, async (req, res, next) => {
  try {
    const post = await postService.likePost(req.body.postId, req.user._id);
    if (!post) throw createHttpError(422);

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

router.put('/unlike', async (req, res, next) => {
  try {
    const post = await postService.unlikePost(req.body.postId, req.user._id);
    if (!post) throw createHttpError(422);

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

router.delete('/deletepost/:postId', requiresAuth, async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await postService.getById(postId);
    if (!post) throw createHttpError(422);
    if (!post.postedBy._id.toString() === req.user._id.toString()) throw createHttpError(405);

    await post.remove();
    res.status(203);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
