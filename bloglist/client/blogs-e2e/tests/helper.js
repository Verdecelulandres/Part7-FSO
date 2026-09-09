const login = async (page, username, password) => {
  await page.goto('/login');
  await page.getByRole('heading', { name: 'Login to application' }).waitFor();
  await page.getByLabel('username').fill(username);
  await page.getByLabel('password').fill(password);
  await page.getByRole('button', { name: 'login' }).click();
}

const createBlog = async (page, title, author, url) => {
  await page.goto('/create');
  await page.getByRole('heading', { name: 'Create new' }).waitFor();
  await page.getByLabel('title:').fill(title);
  await page.getByLabel('author:').fill(author);
  await page.getByLabel('url:').fill(url);
  await page.getByRole('button', { name: 'create' }).click();
  await page.getByText(title, { exact: true }).waitFor();
}

const likeBlog = async (page) => {
  let likeSpanContent = await page
    .getByText(/^likes \d$/)
    .textContent();
  likeSpanContent = likeSpanContent.split(' ');
  likeSpanContent[1] = String(Number(likeSpanContent[1]) + 1);
  likeSpanContent = likeSpanContent.join(' ');

  await page.getByRole('button', { name: 'like' }).click();
  await page.getByText(likeSpanContent, { exact: true }).waitFor();
}

const goToBlog = async (page, blogTitle) => {
  await page.getByRole('link', { name: blogTitle }).click();
  const blogTitleRegex = new RegExp(`^${blogTitle}$`);
  await page.locator('.blog-title', { hasText: blogTitleRegex }).waitFor();
}

const goHome = async (page) => {
  await page.goto('/');
  await page.getByRole('heading', { name: 'blogs' }).waitFor();
}

export { login, createBlog, likeBlog, goToBlog, goHome }