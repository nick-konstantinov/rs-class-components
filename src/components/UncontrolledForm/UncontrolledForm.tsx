import { useState, type FormEvent } from 'react';
import clsx from 'clsx';
import Button from '@/components/Button/Button';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter/PasswordStrengthMeter';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addSubmission } from '@/store/submissionsSlice';
import { selectCountries } from '@/store/countriesSlice';
import { formSchema } from '@/validation/schema';
import { fileToBase64 } from '@/utils/file';
import styles from '@/styles/form.module.scss';

interface UncontrolledFormProps {
  onSuccess: () => void;
}

type FieldErrors = Record<string, string>;

export default function UncontrolledForm({ onSuccess }: UncontrolledFormProps) {
  const dispatch = useAppDispatch();
  const countries = useAppSelector(selectCountries);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const imageInput = form.elements.namedItem('image');
    const imageFile =
      imageInput instanceof HTMLInputElement ? (imageInput.files?.[0] ?? null) : null;

    const result = formSchema.safeParse({
      name: String(data.get('name') ?? ''),
      age: Number(data.get('age')),
      email: String(data.get('email') ?? ''),
      password: String(data.get('password') ?? ''),
      confirmPassword: String(data.get('confirmPassword') ?? ''),
      gender: String(data.get('gender') ?? ''),
      terms: data.get('terms') === 'on',
      country: String(data.get('country') ?? ''),
      image: imageFile,
    });

    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    const image = await fileToBase64(result.data.image);
    dispatch(
      addSubmission({
        source: 'uncontrolled',
        name: result.data.name,
        age: result.data.age,
        email: result.data.email,
        gender: result.data.gender,
        terms: result.data.terms,
        country: result.data.country,
        image,
      }),
    );

    form.reset();
    setPassword('');
    onSuccess();
  };

  return (
    <form className={clsx(styles.form, styles.primaryAccent)} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="unc-name">
          Name
        </label>
        <input
          className={styles.input}
          id="unc-name"
          name="name"
          type="text"
          aria-invalid={errors.name ? true : undefined}
        />
        <p className={styles.error}>{errors.name}</p>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="unc-email">
          Email
        </label>
        <input
          className={styles.input}
          id="unc-email"
          name="email"
          type="email"
          aria-invalid={errors.email ? true : undefined}
        />
        <p className={styles.error}>{errors.email}</p>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="unc-password">
          Password
        </label>
        <input
          className={styles.input}
          id="unc-password"
          name="password"
          type="password"
          aria-invalid={errors.password ? true : undefined}
          onChange={(event) => setPassword(event.target.value)}
        />
        <PasswordStrengthMeter password={password} />
        <p className={styles.error}>{errors.password}</p>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="unc-confirm-password">
          Confirm password
        </label>
        <input
          className={styles.input}
          id="unc-confirm-password"
          name="confirmPassword"
          type="password"
          aria-invalid={errors.confirmPassword ? true : undefined}
        />
        <p className={styles.error}>{errors.confirmPassword}</p>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="unc-country">
          Country
        </label>
        <input
          className={styles.input}
          id="unc-country"
          name="country"
          type="text"
          list="unc-country-list"
          autoComplete="off"
          aria-invalid={errors.country ? true : undefined}
        />
        <datalist id="unc-country-list">
          {countries.map((country) => (
            <option key={country} value={country} />
          ))}
        </datalist>
        <p className={styles.error}>{errors.country}</p>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="unc-age">
          Age
        </label>
        <input
          className={styles.input}
          id="unc-age"
          name="age"
          type="number"
          aria-invalid={errors.age ? true : undefined}
        />
        <p className={styles.error}>{errors.age}</p>
      </div>

      <fieldset className={styles.field}>
        <legend className={styles.label}>Gender</legend>
        <div className={styles.radios}>
          <label className={styles.radio} htmlFor="unc-gender-male">
            <input id="unc-gender-male" name="gender" type="radio" value="male" />
            Male
          </label>
          <label className={styles.radio} htmlFor="unc-gender-female">
            <input id="unc-gender-female" name="gender" type="radio" value="female" />
            Female
          </label>
        </div>
        <p className={styles.error}>{errors.gender}</p>
      </fieldset>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="unc-image">
          Profile image
        </label>
        <input
          className={styles.input}
          id="unc-image"
          name="image"
          type="file"
          accept="image/png,image/jpeg"
          aria-invalid={errors.image ? true : undefined}
        />
        <p className={styles.error}>{errors.image}</p>
      </div>

      <div className={styles.field}>
        <label className={styles.checkbox} htmlFor="unc-terms">
          <input id="unc-terms" name="terms" type="checkbox" />I accept the terms and conditions
        </label>
        <p className={styles.error}>{errors.terms}</p>
      </div>

      <Button type="submit" variant="primary">
        Submit
      </Button>
    </form>
  );
}
