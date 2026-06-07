import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import Button from '@/components/Button/Button';
import CountryAutocomplete from '@/components/CountryAutocomplete/CountryAutocomplete';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addSubmission } from '@/store/submissionsSlice';
import { selectCountries } from '@/store/countriesSlice';
import styles from './RhfForm.module.scss';

interface RhfFormProps {
  onSuccess: () => void;
}

interface RhfFormValues {
  name: string;
  age: number;
  email: string;
  gender: string;
  terms: boolean;
  country: string;
  image: FileList;
  password: string;
  confirmPassword: string;
}

export default function RhfForm({ onSuccess }: RhfFormProps) {
  const dispatch = useAppDispatch();
  const countries = useAppSelector(selectCountries);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<RhfFormValues>();

  const onSubmit: SubmitHandler<RhfFormValues> = (values) => {
    dispatch(
      addSubmission({
        source: 'rhf',
        name: values.name,
        age: values.age,
        email: values.email,
        gender: values.gender,
        terms: values.terms,
        country: values.country,
        image: null,
      }),
    );
    reset();
    onSuccess();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="rhf-name">
          Name
        </label>
        <input className={styles.input} id="rhf-name" type="text" {...register('name')} />
        <p className={styles.error}>{errors.name?.message}</p>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="rhf-email">
          Email
        </label>
        <input className={styles.input} id="rhf-email" type="email" {...register('email')} />
        <p className={styles.error}>{errors.email?.message}</p>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="rhf-password">
          Password
        </label>
        <input
          className={styles.input}
          id="rhf-password"
          type="password"
          {...register('password')}
        />
        <p className={styles.error}>{errors.password?.message}</p>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="rhf-confirm-password">
          Confirm password
        </label>
        <input
          className={styles.input}
          id="rhf-confirm-password"
          type="password"
          {...register('confirmPassword')}
        />
        <p className={styles.error}>{errors.confirmPassword?.message}</p>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="rhf-country">
          Country
        </label>
        <Controller
          name="country"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <CountryAutocomplete
              id="rhf-country"
              className={styles.input}
              countries={countries}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
        <p className={styles.error}>{errors.country?.message}</p>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="rhf-age">
          Age
        </label>
        <input
          className={styles.input}
          id="rhf-age"
          type="number"
          {...register('age', { valueAsNumber: true })}
        />
        <p className={styles.error}>{errors.age?.message}</p>
      </div>

      <fieldset className={styles.field}>
        <legend className={styles.label}>Gender</legend>
        <div className={styles.radios}>
          <label className={styles.radio} htmlFor="rhf-gender-male">
            <input id="rhf-gender-male" type="radio" value="male" {...register('gender')} />
            Male
          </label>
          <label className={styles.radio} htmlFor="rhf-gender-female">
            <input id="rhf-gender-female" type="radio" value="female" {...register('gender')} />
            Female
          </label>
        </div>
        <p className={styles.error}>{errors.gender?.message}</p>
      </fieldset>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="rhf-image">
          Profile image
        </label>
        <input
          className={styles.input}
          id="rhf-image"
          type="file"
          accept="image/png,image/jpeg"
          {...register('image')}
        />
        <p className={styles.error}>{errors.image?.message}</p>
      </div>

      <div className={styles.field}>
        <label className={styles.checkbox} htmlFor="rhf-terms">
          <input id="rhf-terms" type="checkbox" {...register('terms')} />I accept the terms and
          conditions
        </label>
        <p className={styles.error}>{errors.terms?.message}</p>
      </div>

      <Button type="submit" variant="accent">
        Submit
      </Button>
    </form>
  );
}
