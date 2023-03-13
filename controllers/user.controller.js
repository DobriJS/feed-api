const router = require('express').Router();
// const createHttpError = require('http-errors');

router.get('/profile', async (req, res) => {
  const user = req.user;
  console.log(user);
  res.status(200).json(user);
});

module.exports = router;
