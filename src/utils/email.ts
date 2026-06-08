export function isEmailValid(email: string): boolean {
  const value = email.trim();

  if (value.length === 0 || value.includes(' ')) {
    return false;
  }

  const atIndex = value.indexOf('@');

  if (atIndex <= 0 || atIndex !== value.lastIndexOf('@')) {
    return false;
  }

  const local = value.slice(0, atIndex);
  const domain = value.slice(atIndex + 1);

  if (local.length === 0 || domain.length === 0 || domain.includes('..')) {
    return false;
  }

  const dotIndex = domain.indexOf('.');

  return dotIndex > 0 && !domain.endsWith('.');
}
