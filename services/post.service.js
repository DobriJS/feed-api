const Post = require('../models/Post');

exports.getAll = () => Post.find().populate('postedBy', '_id name').sort('-createdAt');

exports.create = (postData) => Post.create(postData);

exports.makeComment = async (postId, comment) => {
  await Post.findByIdAndUpdate(
    postId,
    {
      $push: { comments: comment }
    },
    { new: true }
  )
    .populate('comments.postedBy', '_id username')
    .populate('postedBy', '_id username')
    .exec();
};
