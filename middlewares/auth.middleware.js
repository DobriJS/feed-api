const jwt = require('jsonwebtoken');
const authService = require('../services/auth.service');
const createHttpError = require('http-errors');

require('dotenv').config();

exports.requiresAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  try {
    if (!authorization) throw createHttpError(400);
    const token = authorization.replace('Bearer ', '');

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) throw createHttpError(400);

    const { _id } = decodedToken;
    const userData = await User.findById(_id).select('-password');

    req.user = userData;
  } catch (error) {
    next(error);
  }

  next();
};
