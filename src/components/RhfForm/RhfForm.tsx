import { Controller, useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/Button/Button';
import CountryAutocomplete from '@/components/CountryAutocomplete/CountryAutocomplete';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter/PasswordStrengthMeter';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addSubmission } from '@/store/submissionsSlice';
import { selectCountries } from '@/store/countriesSlice';
import { formSchema, type FormValues } from '@/validation/schema';
import { fileToBase64 } from '@/utils/file';
import styles from '@/styles/form.module.scss';

interface RhfFormProps {
  onSuccess: () => void;
}

export default function RhfForm({ onSuccess }: RhfFormProps) {
  const dispatch = useAppDispatch();
  const countries = useAppSelector(selectCountries);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
  });

  const passwordValue = useWatch({ control, name: 'password' }) ?? '';

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const image = await fileToBase64(values.image);
    dispatch(
      addSubmission({
        source: 'rhf',
        name: values.name,
        age: values.age,
        email: values.email,
        gender: values.gender,
        terms: values.terms,
        country: values.country,
        image,
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
        <input
          className={styles.input}
          id="rhf-name"
          type="text"
          aria-invalid={errors.name ? true : undefined}
          {...register('name')}
        />
        <p className={styles.error}>{errors.name?.message}</p>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="rhf-email">
          Email
        </label>
        <input
          className={styles.input}
          id="rhf-email"
          type="email"
          aria-invalid={errors.email ? true : undefined}
          {...register('email')}
        />
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
          aria-invalid={errors.password ? true : undefined}
          {...register('password')}
        />
        <PasswordStrengthMeter password={passwordValue} />
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
          aria-invalid={errors.confirmPassword ? true : undefined}
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
              invalid={!!errors.country}
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
          aria-invalid={errors.age ? true : undefined}
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
        <Controller
          name="image"
          control={control}
          render={({ field: { onChange, onBlur, ref } }) => (
            <input
              ref={ref}
              className={styles.input}
              id="rhf-image"
              type="file"
              accept="image/png,image/jpeg"
              aria-invalid={errors.image ? true : undefined}
              onBlur={onBlur}
              onChange={(event) => onChange(event.target.files?.[0])}
            />
          )}
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

      <Button type="submit" variant="accent" disabled={!isValid}>
        Submit
      </Button>
    </form>
  );
}
