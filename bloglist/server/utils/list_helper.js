const dummy = (blogs) => {
  return blogs.length > 0 ? 1 : 1;
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  }
  return blogs.reduce((sum, current) =>
    sum + (current.likes ? current.likes : 0), 0);
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  let mostLiked = {};
  let maxLikes = 0;
  blogs.forEach(b => {
    if (b.likes > maxLikes) {
      maxLikes = b.likes;
      mostLiked = b;
    }
  });
  return mostLiked;
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  let authors = new Map();
  let maxBlogs = 0;
  let maxAuthor = '';
  blogs.forEach(b => {
    if (authors.has(b.author)) {
      authors.set(b.author, (authors.get(b.author) + 1));
    } else {
      authors.set(b.author, 1);
    }
    if (authors.get(b.author) > maxBlogs) {
      maxBlogs = authors.get(b.author);
      maxAuthor = b.author;
    }
  });
  return { author: maxAuthor, blogs: maxBlogs };
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  let authors = new Map();
  let maxLikes = 0;
  let maxAuthor = '';
  blogs.forEach(b => {
    if (authors.has(b.author)) {
      authors.set(b.author, (authors.get(b.author) + b.likes));
    } else {
      authors.set(b.author, b.likes);
    }
    if (authors.get(b.author) > maxLikes) {
      maxLikes = authors.get(b.author);
      maxAuthor = b.author;
    }
  });
  return { author: maxAuthor, likes: maxLikes };
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}