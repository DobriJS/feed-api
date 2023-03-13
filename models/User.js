const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

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
  },
  followers: [{ type: ObjectId, ref: 'User' }],
  following: [{ type: ObjectId, ref: 'User' }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
