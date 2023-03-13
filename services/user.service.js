const User = require('../models/User');

exports.getUserById = (_id) => User.findById(_id);
