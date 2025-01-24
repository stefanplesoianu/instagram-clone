const { remote } = require('webdriverio');
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET;
const validToken = jwt.sign({ id:1, username: 'admin' }, JWT_SECRET, { expiresIn: '1hr' })

describe('Comment Feature - Selenium', () => {
    let browser;
    let postId = 1;
    let commentId = null;

    before(async () => {
        browser = await remote({
            logLevel: 'info',
            path: '/',
            capabilities: {
                browserName: 'chrome',
            }
        });
    });

    after(async () => {
        await browser.deleteSession();
    });

    it('should create a comment successfully', async () => {
        await browser.url(`http://localhost:5173/posts/${postId}/create-comment`);

        const contentInput = await browser.$('input[name="content"]');
        const submitButton = await browser.$('button[type="submit"]');

        await contentInput.setValue('This is a Selenium test comment!');
        await submitButton.click();

        const successMessage = await browser.$('.comment-success-message');
        const comment = await browser.$('.comment-item');

        await expect(successMessage).toBeDisplayed();
        await expect(comment).toHaveText('This is a Selenium test comment!');

        commentId = await comment.getAttribute('data-id');
    });

    it('should delete a comment successfully', async () => {
        await browser.url(`http://localhost:3000/posts/${postId}/${commentId}/delete-comment`);

        const successMessage = await browser.$('.comment-deleted-message');
        
        await expect(successMessage).toBeDisplayed();
    });
})