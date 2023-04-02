const Post = require('../models/Post');

exports.getAll = () =>
  Post.find()
    .populate('postedBy', '_id username pic')
    .populate('comments.postedBy', 'username pic')
    .sort('-createdAt');

exports.getPostById = async (_id) =>
  await Post.findOne({ _id }).populate('postedBy', 'username').exec();

exports.create = (postData) => Post.create(postData);

exports.makeComment = async (_id, comment) => {
  const post = await Post.findByIdAndUpdate(
    _id,
    {
      $push: { comments: comment }
    },
    { new: true }
  )
    .populate('comments.postedBy', 'username pic')
    .populate('postedBy', '_id username pic');

  return post;
};

exports.deleteComment = async (_id, commentId) => {
  const post = await Post.findById(_id);
  post.comments = post.comments.filter((id) => !id.equals(commentId));

  const updatedPost = await Post.findByIdAndUpdate(_id, post, {
    new: true
  })
    .populate('comments.postedBy', 'username pic')
    .populate('postedBy', '_id username pic')
    .exec();

  return updatedPost;
};

exports.likePost = async (_id, userId) => {
  const post = await Post.findById(_id);
  const index = post.likes.findIndex((id) => id.equals(userId));

  if (index === -1) {
    post.likes.push(userId);
  } else {
    post.likes = post.likes.filter((id) => !id.equals(userId));
  }

  const updatedPost = await Post.findByIdAndUpdate(_id, post, {
    new: true
  })
    .populate('comments.postedBy', 'username pic')
    .populate('postedBy', '_id username pic')
    .exec();

  return updatedPost;
};

exports.updatePost = async (_id, { title, body, image }) => {
  const updatedPost = await Post.findByIdAndUpdate(_id, { title, body, image }, { new: true })
    .populate('comments.postedBy', 'username pic')
    .populate('postedBy', '_id username pic')
    .exec();
  return updatedPost;
};
