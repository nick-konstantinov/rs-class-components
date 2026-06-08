import { type FormEvent } from 'react';
import clsx from 'clsx';
import Button from '@/components/Button/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addSubmission } from '@/store/submissionsSlice';
import { selectCountries } from '@/store/countriesSlice';
import styles from '@/styles/form.module.scss';

interface UncontrolledFormProps {
  onSuccess: () => void;
}

export default function UncontrolledForm({ onSuccess }: UncontrolledFormProps) {
  const dispatch = useAppDispatch();
  const countries = useAppSelector(selectCountries);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    dispatch(
      addSubmission({
        source: 'uncontrolled',
        name: String(data.get('name') ?? ''),
        age: Number(data.get('age')),
        email: String(data.get('email') ?? ''),
        gender: String(data.get('gender') ?? ''),
        terms: data.get('terms') === 'on',
        country: String(data.get('country') ?? ''),
        image: null,
      }),
    );

    form.reset();
    onSuccess();
  };

  return (
    <form className={clsx(styles.form, styles.primaryAccent)} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="unc-name">
          Name
        </label>
        <input className={styles.input} id="unc-name" name="name" type="text" />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="unc-email">
          Email
        </label>
        <input className={styles.input} id="unc-email" name="email" type="email" />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="unc-password">
          Password
        </label>
        <input className={styles.input} id="unc-password" name="password" type="password" />
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
        />
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
        />
        <datalist id="unc-country-list">
          {countries.map((country) => (
            <option key={country} value={country} />
          ))}
        </datalist>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="unc-age">
          Age
        </label>
        <input className={styles.input} id="unc-age" name="age" type="number" />
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
        />
      </div>

      <div className={styles.field}>
        <label className={styles.checkbox} htmlFor="unc-terms">
          <input id="unc-terms" name="terms" type="checkbox" />I accept the terms and conditions
        </label>
      </div>

      <Button type="submit" variant="primary">
        Submit
      </Button>
    </form>
  );
}
