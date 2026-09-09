/* eslint-disable no-undef */
const { test, expect, beforeEach, describe } = require('@playwright/test');
const { login, createBlog, likeBlog, goToBlog, goHome } = require('./helper');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/test/reset');
    await request.post('/api/users', {
      data: {
        username: 'test',
        password: 'password',
        name: 'Test user'
      }
    });
    await page.goto('/');
  });

  test('Login form is shown', async ({ page }) => {
    await page.goto('/login');
    const usernameInput = await page.getByRole('textbox', { name: 'username' });
    const pwdInput = await page.getByRole('textbox', { name: 'password' });
    const loginBtn = await page.getByRole('button', { name: 'login' });

    await expect(usernameInput).toBeVisible();
    await expect(pwdInput).toBeVisible();
    await expect(loginBtn).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await login(page, 'test', 'password');
      await page.getByRole('heading', { name: 'blogs' }).waitFor();
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'new blog' })).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await login(page, 'test', 'wrong');
      const errorMsg = page.getByRole('alert');
      await expect(errorMsg).toContainText('wrong username or password');

      // await expect(errorMsg).toHaveCSS('border-style', 'solid');
      // await expect(errorMsg).toHaveCSS('color', 'rgb(255, 0, 0)');
      // await expect(page.getByText('Test user logged in')).not.toBeVisible();
    });

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await login(page, 'test', 'password');
        await page.getByRole('heading', { name: 'blogs' }).waitFor();
      });

      test('a new blog can be created', async ({ page }) => {

        await createBlog(page, 'Test blog', 'Test Author', 'www.test.com');

        await expect(page.getByText('Test blog', { exact: true })).toBeVisible();
      });

      describe('When blogs exist', () => {
        beforeEach(async ({ page }) => {
          await createBlog(page, 'blog1', 'author1', 'www.blog1.com');
          await createBlog(page, 'blog2', 'author2', 'www.blog2.com');
        });

        test('a blog can be liked', async ({ page }) => {
          // Testing with last blog in list.
          await goToBlog(page, 'blog2');
          const likesSpan = page.locator('.blog-likes');
          await expect(likesSpan).toContainText('likes 0');
          await likeBlog(page);
          await expect(likesSpan).toContainText('likes 1');
        });

        describe('When deleting', () => {
          test('blog creator can delete a blog', async ({ page }) => {
            page.on('dialog', dialog => dialog.accept());
            const blogToRemoveLink = await page.getByRole('link', { name: 'blog2' });
            await goToBlog(page, 'blog2');
            await page.getByRole('button', { name: 'remove' }).click();
            await page.getByRole('heading', { name: 'blogs' }).waitFor();

            await expect(blogToRemoveLink).not.toBeVisible();
          });

          test('only blog creator sees remove button', async ({ page, request }) => {
            await request.post('/api/users', {
              data: {
                username: 'other',
                password: 'password',
                name: 'Other user'
              }
            });
            await page.getByRole('button', { name: 'logout' }).click();
            await login(page, 'other', 'password');
            await page.getByRole('heading', { name: 'blogs' }).waitFor();
            await createBlog(page, 'blog3', 'author3', 'www.blog3.com');

            await goToBlog(page, 'blog3');

            await expect(page.getByRole('button', { name: 'remove' })).toBeVisible();

            await goHome(page);

            await goToBlog(page, 'blog1');

            await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible();
          });

        });

        describe('When liking', () => {
          beforeEach(async ({ page }) => {
            await goToBlog(page, 'blog2');

            await likeBlog(page);
            await likeBlog(page);

            await goHome(page);

            await goToBlog(page, 'blog1');
            await likeBlog(page);

            await goHome(page);
          });

          test('blogs are sorted according to likes descendently', async ({ page }) => {
            const allBlogs = await page.locator('.blog-link');

            await allBlogs.first().click();
            await page.getByRole('heading', { name: 'blog2' }).waitFor();

            await expect(page.locator('.blog-likes')).toContainText('likes 2');
            await expect(page.locator('.blog-title')).toContainText('blog2');

            await goHome(page);

            await allBlogs.last().click();
            await page.getByRole('heading', { name: 'blog1' }).waitFor();

            await expect(page.locator('.blog-likes')).toContainText('likes 1');
            await expect(page.locator('.blog-title')).toContainText('blog1');
          });

        });
      });
    });
  });
});