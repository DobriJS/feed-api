const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    likes: [{ type: ObjectId, ref: 'User' }],
    comments: [
      {
        text: String,
        postedBy: { type: ObjectId, ref: 'User' },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    postedBy: {
      type: ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
