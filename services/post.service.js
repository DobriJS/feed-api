const Post = require('../models/Post');

exports.getAll = () =>
  Post.find()
    .populate('postedBy', '_id username')
    .populate('comments.postedBy', '_id username')
    .sort('-createdAt');

exports.getPostById = async (_id) =>
  await Post.findOne({ _id }).populate('postedBy', 'username').exec();

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

exports.updatePost = async (_id, { title, body, image }) => {
  const updatedPost = await Post.findByIdAndUpdate(_id, { title, body, image }, { new: true });
  return updatedPost;
};
