const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt');

exports.findByEmail = (email) => User.findOne({ email });

exports.register = async (username, email, password, pic) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    username,
    email,
    password: hashedPassword,
    pic
  });
};

exports.login = async (email, password) => {
  const user = await this.findByEmail(email);

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Invalid email or password');

  const payload = { _id: user._id };
  const token = await jwt.sign(payload, process.env.JWT_SECRET);
  const { _id, username, pic, followers, following } = user;

  return {
    token,
    _id,
    username,
    pic,
    followers,
    following
  };
};
