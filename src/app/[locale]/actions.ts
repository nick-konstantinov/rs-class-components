'use server';

import { redirect } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';

export async function searchAction(locale: Locale, formData: FormData) {
  const raw = formData.get('q');
  const q = typeof raw === 'string' ? raw.trim() : '';

  const query: Record<string, string | number> = { page: 1 };
  if (q) {
    query.q = q;
  }

  redirect({ href: { pathname: '/', query }, locale });
}
