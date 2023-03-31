const router = require('express').Router();
const authServices = require('../services/auth.service');
const createHttpError = require('http-errors');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     pic:
 *                       type: string
 *                     followers:
 *                       type: array
 *                       items:
 *                         type: string
 *                     following:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Invalid email or password
 */

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) throw createHttpError(400, 'Please add all the fields');

    const user = await authServices.login(email, password);
    if (!user) throw createHttpError(401);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               pic:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing required fields
 */

router.post('/register', async (req, res, next) => {
  const { username, email, password, pic } = req.body;

  try {
    if (!email || !password || !username) throw createHttpError(400, 'Please add all the fields');

    const user = await authServices.register(username, email, password, pic);

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
