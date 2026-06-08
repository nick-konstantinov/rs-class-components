import { isEmailValid } from './email';

describe('isEmailValid', () => {
  it.each(['alice@mail.com', 'a@b.co', 'john.doe@sub.example.org'])('accepts %s', (email) => {
    expect(isEmailValid(email)).toBe(true);
  });

  it.each([
    ['', 'empty'],
    ['usermail.com', 'no @'],
    ['a@b@c.com', 'two @'],
    ['@mail.com', 'empty local'],
    ['user@', 'empty domain'],
    ['user@mail', 'no dot in domain'],
    ['user@.com', 'dot at domain start'],
    ['user@mail.', 'dot at domain end'],
    ['user@mail..com', 'consecutive dots'],
    ['us er@mail.com', 'contains a space'],
  ])('rejects %s (%s)', (email) => {
    expect(isEmailValid(email)).toBe(false);
  });
});
