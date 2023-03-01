const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  pic: {
    type: String,
    default:
      'https://www.shutterstock.com/image-vector/default-avatar-profile-trendy-style-260nw-1759726295.jpg'
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
