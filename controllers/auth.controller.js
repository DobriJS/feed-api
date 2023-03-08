const router = require('express').Router();
const authServices = require('../services/auth.service');
const createHttpError = require('http-errors');

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
