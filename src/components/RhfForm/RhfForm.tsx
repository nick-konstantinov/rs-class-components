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
import { formFields, type FieldConfig } from './fields';

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

  const renderControl = (field: FieldConfig) => {
    switch (field.type) {
      case 'input':
        return (
          <>
            <input
              className={styles.input}
              id={field.id}
              type={field.inputType}
              aria-invalid={errors[field.name] ? true : undefined}
              {...register(field.name, field.valueAsNumber ? { valueAsNumber: true } : undefined)}
            />
            {field.withStrengthMeter && <PasswordStrengthMeter password={passwordValue} />}
          </>
        );
      case 'country':
        return (
          <Controller
            name="country"
            control={control}
            defaultValue=""
            render={({ field: controllerField }) => (
              <CountryAutocomplete
                id={field.id}
                className={styles.input}
                countries={countries}
                value={controllerField.value}
                onChange={controllerField.onChange}
                onBlur={controllerField.onBlur}
                invalid={!!errors.country}
              />
            )}
          />
        );
      case 'file':
        return (
          <Controller
            name="image"
            control={control}
            render={({ field: { onChange, onBlur, ref } }) => (
              <input
                ref={ref}
                className={styles.input}
                id={field.id}
                type="file"
                accept={field.accept}
                aria-invalid={errors.image ? true : undefined}
                onBlur={onBlur}
                onChange={(event) => onChange(event.target.files?.[0])}
              />
            )}
          />
        );
      case 'radio':
        return (
          <div className={styles.radios}>
            {field.options.map((option) => (
              <label className={styles.radio} htmlFor={option.id} key={option.id}>
                <input id={option.id} type="radio" value={option.value} {...register(field.name)} />
                {option.label}
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      {formFields.map((field) => {
        if (field.type === 'radio') {
          return (
            <fieldset className={styles.field} key={field.id}>
              <legend className={styles.label}>{field.label}</legend>
              {renderControl(field)}
              <p className={styles.error}>{errors[field.name]?.message}</p>
            </fieldset>
          );
        }

        if (field.type === 'checkbox') {
          return (
            <div className={styles.field} key={field.id}>
              <label className={styles.checkbox} htmlFor={field.id}>
                <input id={field.id} type="checkbox" {...register(field.name)} />
                {field.label}
              </label>
              <p className={styles.error}>{errors[field.name]?.message}</p>
            </div>
          );
        }

        return (
          <div className={styles.field} key={field.id}>
            <label className={styles.label} htmlFor={field.id}>
              {field.label}
            </label>
            {renderControl(field)}
            <p className={styles.error}>{errors[field.name]?.message}</p>
          </div>
        );
      })}

      <Button type="submit" variant="accent" disabled={!isValid}>
        Submit
      </Button>
    </form>
  );
}
