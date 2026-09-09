import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import { beforeEach, describe, expect, test } from 'vitest';

describe('<Blog /> tests', () => {

  const blog = {
    title: 'Test blog',
    author: 'test',
    url: 'www.test.com',
    likes: 1,
    user: {
      name: 'testUser',
      id: '1'
    }
  }
  const likeBlog = vi.fn();

  test('Renders certain blog parts by default', () => {
    const { container } = render(<Blog blog={blog} likeBlog={likeBlog} />);

    const titleSpan = container.querySelector('.blog-title');
    const authorSpan = container.querySelector('.blog-author');
    const urlDiv = container.querySelector('.blog-url');
    const userDiv = container.querySelector('.blog-user');

    expect(titleSpan).toHaveTextContent('Test blog');
    expect(authorSpan).toHaveTextContent('test:');
    expect(urlDiv).toHaveTextContent('www.test.com');
    expect(userDiv).toHaveTextContent('Added by testUser');

    const likeSpan = container.querySelector('.blog-likes');
    expect(likeSpan).toBeVisible();
    expect(likeSpan).toHaveTextContent('likes 1');

    const likeBtn = container.querySelector('.blog-like-btn');
    expect(likeBtn).toBeNull();

    const removeBtn = container.querySelector('.blog-remove-btn');
    expect(removeBtn).toBeNull();
  });

  describe('When logged in', () => {

    test('as other user show only like button', async () => {
      const otherUser = {
        name: 'otherUser',
        id: 2
      }
      const { container } = render(<Blog blog={blog} likeBlog={likeBlog} loggedUser={otherUser} />);

      const likeBtn = container.querySelector('.blog-like-btn');
      expect(likeBtn).toBeVisible();

      const removeBtn = container.querySelector('.blog-remove-btn');
      expect(removeBtn).toBeNull();
    });

    describe('As blog creator', () => {
      beforeEach(() => {
        const user = {
          name: 'testUser',
          id: 1
        }
        render(<Blog blog={blog} likeBlog={likeBlog} loggedUser={user} />);
      });

      test('remove button is shown', async () => {
        const removeBtn = screen.getByRole('button', { name: 'remove' });
        expect(removeBtn).toBeVisible();
      });

      test('like callback is called correctly', async () => {
        const user = userEvent.setup();

        const likeBtn = screen.getByRole('button', { name: 'like' });
        await user.click(likeBtn);
        await user.click(likeBtn);

        expect(likeBlog.mock.calls).toHaveLength(2);
      });
    });
  });
});