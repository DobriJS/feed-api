const Post = require('../models/Post');

exports.getAll = () =>
  Post.find()
    .populate('postedBy', '_id username')
    .populate('comments.postedBy', '_id username')
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
    .populate('comments.postedBy', '_id username')
    .populate('postedBy', '_id username')
    .exec();

  return post;
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
    .populate('postedBy', '_id username')
    .exec();

  return updatedPost;
};

exports.updatePost = async (_id, { title, body, image }) => {
  const updatedPost = await Post.findByIdAndUpdate(_id, { title, body, image }, { new: true });
  return updatedPost;
};
