const router = require('express').Router();
const userService = require('../services/user.service');
const createHttpError = require('http-errors');

/**
 * @swagger
 * user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 pic:
 *                   type: string
 *                 followers:
 *                   type: array
 *                   items:
 *                     type: string
 *                 following:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized access
 *       422:
 *         description: User not found
 */

router.get('/profile', async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user._id);
    if (!user) throw createHttpError(422);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
