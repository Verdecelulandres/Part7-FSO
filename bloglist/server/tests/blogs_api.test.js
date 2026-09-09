const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./tests_helper');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  const pwdHash = await bcrypt.hash('pwd', 10);
  const newUser = new User({
    username: 'root',
    passwordHash: pwdHash
  });
  const creatorUser = await newUser.save();
  const otherUser = new User({
    username: 'other',
    passwordHash: pwdHash
  });
  await otherUser.save();
  const userBlogs = helper.blogs.map(b => {
    b.user = creatorUser._id;
    return b;
  });
  await Blog.insertMany(userBlogs);
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('correct amount of blogs is returned', async () => {
  const result = await api.get('/api/blogs');
  assert.strictEqual(result.body.length, helper.blogs.length);
});

test('unique id is called id', async () => {
  const result = await api.get('/api/blogs');
  const objectKeys = [];
  result.body.forEach(b => {
    const keys = Object.keys(b);
    objectKeys.push(...keys);
  });

  assert(!objectKeys.includes('_id'));
  assert(objectKeys.includes('id'));
});

test('correctly creates blog', async () => {
  const newBlog = {
    title: 'cincuentaycuatro',
    author: 'AndrewdaGreen',
    url: 'jeje',
    likes: 69,
  };
  const loginCredentials = {
    username: 'other',
    password: 'pwd'
  };
  const loginResponse = await api
    .post('/api/login')
    .send(loginCredentials)
    .expect(200);

  const { token } = loginResponse._body;

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const createdBlog = response.body;

  const blogsAfter = await helper.blogsInDB();
  const targetBlog = blogsAfter.find(b => b.id === createdBlog.id);

  targetBlog.user = targetBlog.user.toString();

  assert.strictEqual(blogsAfter.length, helper.blogs.length + 1);
  assert.deepStrictEqual(targetBlog, createdBlog);
});

test('cannot create blog without token', async () => {
  const blogsBefore = helper.blogsInDB();

  const newBlog = {
    title: 'cincuentaycuatro',
    author: 'AndrewdaGreen',
    url: 'jeje',
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401);

  const blogsAfter = helper.blogsInDB();
  assert.strictEqual(blogsBefore.length, blogsAfter.length);
});

test('blog with no likes prop defaults to 0', async () => {
  const newBlog = {
    title: 'cincuentaycuatro',
    author: 'AndrewdaGreen',
    url: 'jeje',
  };
  const loginCredentials = {
    username: 'other',
    password: 'pwd'
  };
  const loginResponse = await api
    .post('/api/login')
    .send(loginCredentials)
    .expect(200);

  const { token } = loginResponse._body;

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);
  assert.strictEqual(response.body.likes, 0);
});

test('blog without title or url props does not get saved', async () => {
  const noTitleBlog = {
    author: 'AndrewdaGreen',
    url: 'jeje',
  };

  const loginCredentials = {
    username: 'other',
    password: 'pwd'
  };
  const loginResponse = await api
    .post('/api/login')
    .send(loginCredentials)
    .expect(200);

  const { token } = loginResponse._body;

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(noTitleBlog)
    .expect(400);

  const noUrlBlog = {
    title: 'cincuentaycuatro',
    author: 'AndrewdaGreen',
  };

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(noUrlBlog)
    .expect(400);

  const blogsAfter = await helper.blogsInDB();
  assert.strictEqual(blogsAfter.length, helper.blogs.length);

});

test('correctly delete blog', async () => {
  const blogsBefore = await helper.blogsInDB();

  const blogToDelete = blogsBefore[0];

  const loginCredentials = {
    username: 'root',
    password: 'pwd'
  };
  const loginResponse = await api
    .post('/api/login')
    .send(loginCredentials)
    .expect(200);

  const { token } = loginResponse._body;

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204);

  const blogsAfter = await helper.blogsInDB();
  const blogIds = blogsAfter.map(b => b.id);

  assert.strictEqual(blogsAfter.length, blogsBefore.length - 1);
  assert(!blogIds.includes(blogToDelete.id));
});

test('correctly update likes of a blog', async () => {
  const blogsBefore = await helper.blogsInDB();
  const blogToUpdate = blogsBefore[0];
  const newLikes = { likes: (blogToUpdate.likes + 1) };
  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(newLikes)
    .expect(200);
  const blogsAfter = await helper.blogsInDB();
  const updatedBlog = blogsAfter.find(b => b.id === blogToUpdate.id);

  assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1);
});

after(async () => {
  await mongoose.connection.close();
});