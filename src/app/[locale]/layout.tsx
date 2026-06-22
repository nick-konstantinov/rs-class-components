import '@/app/globals.scss';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { readThemeCookie } from '@/lib/theme.server';
import { StoreProvider } from '@/providers/StoreProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Header } from '@/components/Header/Header';
import { Flyout } from '@/components/Flyout/Flyout';
import styles from './layout.module.scss';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'app' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const initialTheme = await readThemeCookie();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <StoreProvider>
            <ThemeProvider initialTheme={initialTheme}>
              <div className={styles.column}>
                <Header />
                <main className={styles.main}>{children}</main>
              </div>
              <Flyout />
            </ThemeProvider>
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
