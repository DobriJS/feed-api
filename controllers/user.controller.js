const router = require('express').Router();
const userService = require('../services/user.service');
const createHttpError = require('http-errors');

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
