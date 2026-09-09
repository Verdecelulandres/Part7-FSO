const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const { userExtractor } = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1, id: 1 });
  response.json(blogs);
});

blogsRouter.post('/', userExtractor, async (request, response) => {
  const { title, url, author, likes } = request.body;
  const newBlog = {
    title,
    url,
    author,
    likes
  };

  const userFromToken = request.user;
  const username = userFromToken.username;
  const user = await User.findOne({ username });
  newBlog.user = user._id;
  const blog = new Blog(newBlog);
  const result = await blog.save();
  user.blogs = user.blogs.concat(result._id);
  await user.save();
  response.status(201).json(result);
});

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const id = request.params.id;
  const userFromToken = request.user;

  const blog = await Blog.findByIdAndDelete(id);

  if (blog.user.toString() !== userFromToken.id.toString()) {
    return response.status(403).json({ error: 'Only blog creator can delete it' });
  }

  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id;
  const { likes } = request.body;
  const blog = await Blog.findById(id);
  if (!blog) {
    return response.status(404).end();
  }
  blog.likes = likes;

  const updatedBlog = await blog.save();
  response.json(updatedBlog);

});

module.exports = blogsRouter;