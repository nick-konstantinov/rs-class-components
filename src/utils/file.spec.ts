import { fileToBase64 } from './file';

describe('fileToBase64', () => {
  it('converts a file to a base64 data URL', async () => {
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });

    const result = await fileToBase64(file);

    expect(result).toMatch(/^data:text\/plain;base64,/);
    expect(result).toBe('data:text/plain;base64,aGVsbG8=');
  });
});
