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

router.put('/edit-post/:id', requiresAuth, async (req, res, next) => {
  const { id } = req.params;
  const { title, body, image } = req.body;

  try {
    const updatedPost = await postService.updatePost(id, { title, body, image });
    if (!updatedPost) throw createHttpError(409);

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', requiresAuth, async (req, res, next) => {
  const { id } = req.params;

  try {
    const signlePost = await postService.getPostById(id);
    if (!signlePost) throw createHttpError(400);

    res.json(signlePost);
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
  const { id } = req.body;

  try {
    const post = await postService.likePost(id, req.user._id);
    if (!post) throw createHttpError(422);

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

router.delete('/delete-post/:id', requiresAuth, async (req, res, next) => {
  const postId = req.params.id;

  try {
    const post = await postService.getPostById(postId);
    if (!post) throw createHttpError(422);
    if (!post.postedBy._id.toString() === req.user._id.toString()) throw createHttpError(405);
    await post.remove();

    res.status(203).json(postId);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
