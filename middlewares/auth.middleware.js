const jwt = require('jsonwebtoken');
const createHttpError = require('http-errors');
const userService = require('../services/user.service');

require('dotenv').config();

exports.requiresAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  try {
    if (!authorization) throw createHttpError(404);
    const token = authorization.replace('Bearer ', '');

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) throw createHttpError(404);

    const { _id } = decodedToken;
    const userData = await userService.getUserById(_id).select('-password');
    req.user = userData;
  } catch (error) {
    next(error);
  }

  next();
};
