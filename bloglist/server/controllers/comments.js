const commentRouter = require("express").Router();
const Comment = require("../models/comment");
const Blog = require("../models/blog");

commentRouter.get("/", async (request, response) => {
  const comments = await Comment.find({});
  response.json(comments);
});
commentRouter.post("/", async (request, response) => {
  const { content, blog: blogid } = request.body;
  const blog = await Blog.findById(blogid);
  const newComment = { content, blog: blog._id };
  const comment = new Comment(newComment);
  const result = await comment.save();
  blog.comments = blog.comments.concat(result._id);
  await blog.save();
  response.status(201).json(result);
});

module.exports = commentRouter;
