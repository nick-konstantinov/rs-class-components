import { cookies } from 'next/headers';
import { THEME_COOKIE, type Theme } from './theme';

export async function readThemeCookie(): Promise<Theme> {
  const cookieStore = await cookies();
  return cookieStore.get(THEME_COOKIE)?.value === 'dark' ? 'dark' : 'light';
}
