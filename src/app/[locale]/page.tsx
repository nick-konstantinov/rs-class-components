import { getTranslations, setRequestLocale } from 'next-intl/server';

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('app');

  return <h1>{t('title')}</h1>;
}
