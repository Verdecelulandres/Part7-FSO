const commentRouter = require("express").Router();
const Comment = require("../models/comment");
// const Blog = require("../models/blog");

commentRouter.get("/", async (request, response) => {
  const comments = await Comment.find({});
  response.json(comments);
});
// commentRouter.post();

module.exports = commentRouter;
