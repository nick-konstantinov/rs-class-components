import { COUNTRIES } from '@/data/countries';
import { formSchema } from './schema';

function makeValidValues() {
  return {
    name: 'Alice',
    age: 30,
    email: 'alice@mail.com',
    password: 'Abcdef1!',
    confirmPassword: 'Abcdef1!',
    gender: 'male',
    terms: true,
    country: COUNTRIES[0],
    image: new File(['x'], 'photo.png', { type: 'image/png' }),
  };
}

function firstErrorPath(values: unknown): string | undefined {
  const result = formSchema.safeParse(values);
  return result.success ? undefined : String(result.error.issues[0].path[0]);
}

describe('formSchema', () => {
  it('accepts a fully valid submission', () => {
    expect(formSchema.safeParse(makeValidValues()).success).toBe(true);
  });

  it('rejects an invalid email', () => {
    expect(firstErrorPath({ ...makeValidValues(), email: 'not-an-email' })).toBe('email');
  });

  it('rejects mismatched passwords on the confirm field', () => {
    expect(firstErrorPath({ ...makeValidValues(), confirmPassword: 'Different1!' })).toBe(
      'confirmPassword',
    );
  });

  it('rejects unaccepted terms', () => {
    expect(firstErrorPath({ ...makeValidValues(), terms: false })).toBe('terms');
  });

  it('rejects a country outside the list', () => {
    expect(firstErrorPath({ ...makeValidValues(), country: 'Atlantis' })).toBe('country');
  });

  it('rejects a non-image file type', () => {
    const image = new File(['x'], 'a.gif', { type: 'image/gif' });
    expect(firstErrorPath({ ...makeValidValues(), image })).toBe('image');
  });
});
