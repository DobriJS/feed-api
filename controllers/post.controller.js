const router = require('express').Router();
const postService = require('../services/post.service');
const { requiresAuth } = require('../middlewares/auth.middleware');
const createHttpError = require('http-errors');

/**
 * @swagger
 * /:
 *  get:
 *    summary: Get all posts
 *    tags: [Post]
 *    description: Returns a list of all posts.
 *    responses:
 *     200:
 *      description: The list of posts.
 */
router.get('/', async (req, res, next) => {
  try {
    const posts = await postService.getAll();
    if (!posts) throw createHttpError(500);

    return res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /create-post:
 *   post:
 *     summary: Create a new post
 *     tags: [Post]
 *     description: Creates a new post with the provided title, body, and image, associated with the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     content:
 *       application/json:
 *        schema:
 *          type: object
 *          properties:
 *            title:
 *             type: string
 *            body:
 *             type: string
 *            image:
 *             type: string
 *
 *
 *     responses:
 *       201:
 *         description: The newly created post.
 *       400:
 *         description: Bad request - Missing required fields.
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token.
 *       500:
 *         description: Internal server error.
 */
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

/**
 * @swagger
 * /edit-post/{id}:
 *   put:
 *     summary: Update a post
 *     tags: [Post]
 *     description: Update a post with the given ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the post to update
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: post
 *         description: Post object that needs to be updated
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *             body:
 *               type: string
 *             image:
 *               type: string
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 body:
 *                   type: string
 *                 image:
 *                   type: string
 *                 postedBy:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     pic:
 *                       type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Not Found
 *       '409':
 *         description: Conflict
 */
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
/**
 * @swagger
 * /{id}:
 *  get:
 *    summary: Get a post
 *    tags: [Post]
 *    description: Get a post with the given ID
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *       description: OK
 *       content:
 *        application/json:
 *         schema:
 *           type: object
 *           properties:
 *            _id:
 *              type: string
 *            title:
 *              type: string
 *            body:
 *              type: string
 *            image:
 *              type: string
 *
 */
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

/**
 * @swagger
 * /like:
 *  put:
 *   summary: Like a post
 *   tags: [Post]
 *   description: Like a post with the given ID
 *   security:
 *    - bearerAuth: []
 */
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

/**
 * @swagger
 * /delete-post/{id}:
 *  delete:
 *   summary: Delete a post
 *   tags: [Post]
 *   description: Delete a post with the given ID
 *   security:
 *    - bearerAuth: []
 */
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

/**
 * @swagger
 * /comment:
 *  put:
 *   summary: Comment on a post
 *   tags: [Post]
 *   description: Comment on a post with the given ID
 *   security:
 *    - bearerAuth: []
 */
router.put('/comment', requiresAuth, async (req, res, next) => {
  const comment = {
    text: req.body.comment.text,
    postedBy: req.user._id
  };

  const postId = req.body.comment.postId;

  try {
    if (!postId) throw createHttpError(400);
    const newPost = await postService.makeComment(postId, comment);

    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /delete-comment/{commentId}:
 *  put:
 *    summary: Delete a comment
 *    tags: [Post]
 *    description: Delete a comment with the given ID
 *    security:
 *      - bearerAuth: []
 */
router.put('/delete-comment/:commentId', requiresAuth, async (req, res, next) => {
  const { commentId } = req.params;
  const { postId } = req.body;

  try {
    const updatedPostComment = await postService.deleteComment(postId, commentId);
    if (!updatedPostComment) throw createHttpError(400);

    res.status(200).json(updatedPostComment);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
