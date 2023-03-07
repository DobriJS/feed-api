const Post = require('../models/Post');

exports.getAll = () => Post.find().populate('postedBy', '_id name').sort('-createdAt');

exports.getById = async (_id) => await Post.findOne({ _id }).populate('postedBy', '_id').exec();

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
