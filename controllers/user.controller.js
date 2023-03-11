const router = require('express').Router();
// const { requiresAuth } = require('../middlewares/auth.middleware');

// const createHttpError = require('http-errors');

router.get('/profile', async (req, res) => {
  const user = req.user;
  res.status(200).json(user);
});

module.exports = router;
