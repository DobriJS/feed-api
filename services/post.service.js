const Post = require('../models/Post');

exports.getAll = () => Post.find().populate('postedBy', '_id name').sort('-createdAt');

exports.getById = async (_id) => await Post.findOne({ _id }).populate('postedBy', '_id').exec();

exports.create = (postData) => Post.create(postData);

exports.makeComment = async (postId, comment) => {
  const post = await Post.findByIdAndUpdate(
    postId,
    {
      $push: { comments: comment }
    },
    { new: true }
  )
    .populate('comments.postedBy', '_id username')
    .populate('postedBy', '_id username')
    .exec();

  return post;
};

exports.likePost = async (postId, _id) => {
  const post = await Post.findByIdAndUpdate(
    postId,
    {
      $push: { likes: _id }
    },
    {
      new: true
    }
  ).exec();

  return post;
};

exports.unlikePost = async (postId, _id) => {
  const post = await Post.findByIdAndUpdate(
    postId,
    {
      $pull: { likes: _id }
    },
    {
      new: true
    }
  ).exec();

  return post;
};
