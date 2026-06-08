import { getPasswordStrength } from './password';

describe('getPasswordStrength', () => {
  it.each([
    ['', 0],
    ['abcdefgh', 1],
    ['Abcdefgh', 2],
    ['Abcdefg1', 3],
    ['Abcdef1!', 4],
    ['Ab1!', 3],
  ])('scores %s as %i', (password, score) => {
    expect(getPasswordStrength(password)).toBe(score);
  });
});
