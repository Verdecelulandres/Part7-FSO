import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateBlogForm from './CreateBlogForm';

describe('<CreateBlogForm /> tests', () => {
  test('Ensure blog creation receives correct data', async () => {
    const createNewBlog = vi.fn();
    const user = userEvent.setup();

    render(<CreateBlogForm createNewBlog={createNewBlog} />);

    const titleInput = screen.getByLabelText('title:');
    const authorInput = screen.getByLabelText('author:');
    const urlInput = screen.getByLabelText('url:');

    await user.type(titleInput, 'Test blog');
    await user.type(authorInput, 'test');
    await user.type(urlInput, 'www.test.com');

    const createBtn = screen.getByText('create');

    await user.click(createBtn);

    expect(createNewBlog.mock.calls).toHaveLength(1);
    expect(createNewBlog.mock.calls[0][0].title).toBe('Test blog');
    expect(createNewBlog.mock.calls[0][0].author).toBe('test');
    expect(createNewBlog.mock.calls[0][0].url).toBe('www.test.com');
  });
});