const { test, describe } = require('node:test');
const assert = require('node:assert');
const { favoriteBlog, mostBlogs, mostLikes, totalLikes } = require('../utils/list_helper');
const { blogs, equalLikeBlogs, listWithOneBlog } = require('./tests_helper');

describe('Favorite blog', () => {

  test('of an empty list is null', () => {
    const result = favoriteBlog([]);
    assert.strictEqual(result, null);
  });

  test('of a bigger list is found correctly', () => {
    const result = favoriteBlog(blogs);
    assert.deepStrictEqual(result, {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    });
  });

  test('of equal likes return the 1st', () => {
    const result = favoriteBlog(equalLikeBlogs);
    assert.deepStrictEqual(result, {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 2,
      __v: 0
    },);
  });
});

describe('Most blogs', () => {

  test('of an empty list is null', () => {
    const result = mostBlogs([]);
    assert.strictEqual(result, null);
  });

  test('of a bigger list is found correctly', () => {
    const result = mostBlogs(blogs);
    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3
    });
  });

  test('of equal blogs return the 1st', () => {
    const result = mostBlogs(equalLikeBlogs);
    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 2
    });
  });
});

describe('Most likes', () => {

  test('of an empty list is null', () => {
    const result = mostLikes([]);
    assert.strictEqual(result, null);
  });

  test('of a bigger list is found correctly', () => {
    const result = mostLikes(blogs);
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 17
    });
  });

  test('of equal blogs return the 1st', () => {
    const result = mostLikes(equalLikeBlogs);
    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      likes: 4
    });
  });
});

describe('total likes', () => {

  const emptyList = [];

  test('of empty list is zero', () => {
    const result = totalLikes(emptyList);
    assert.strictEqual(result, 0);
  });

  test('when list has only one blog, equals the likes of that', () => {
    const result = totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test('of a bigger list is calculated right', () => {
    const result = totalLikes(blogs);
    assert.strictEqual(result, 36);
  });

});