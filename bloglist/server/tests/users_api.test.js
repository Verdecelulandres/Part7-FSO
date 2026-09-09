const { test, after, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const User = require('../models/user');
const helper = require('./tests_helper');

const api = supertest(app);

describe('User tests', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const pwdHash = await bcrypt.hash('pwd', 10);
    const newUser = new User({
      username: 'root',
      passwordHash: pwdHash
    });
    await newUser.save();
  });

  describe('Incorrect user creation is stopped', () => {
    test('User with short password is not created', async () => {
      const usersBefore = await helper.usersInDb();
      const wrongUser = {
        username: 'wrong',
        password: '12'
      }

      await api
        .post('/api/users')
        .send(wrongUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersAfter = await helper.usersInDb();
      assert(usersBefore.length, usersAfter.length);
    });

    test('User with short username is not created', async () => {
      const usersBefore = await helper.usersInDb();
      const wrongUser = {
        username: 'wg',
        password: '123'
      }

      await api
        .post('/api/users')
        .send(wrongUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersAfter = await helper.usersInDb();
      assert(usersBefore.length, usersAfter.length);
    });

    test('Duplicate entries are not allowed', async () => {
      const usersBefore = await helper.usersInDb();
      const wrongUser = {
        username: 'root',
        password: '123'
      }

      await api
        .post('/api/users')
        .send(wrongUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersAfter = await helper.usersInDb();
      assert(usersBefore.length, usersAfter.length);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});