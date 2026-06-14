import type { FormValues } from '@/validation/schema';
import { ACCEPTED_IMAGE_TYPES } from '@/validation/schema';

type FieldName = keyof FormValues;

interface BaseField {
  name: FieldName;
  id: string;
  label: string;
}

interface InputField extends BaseField {
  type: 'input';
  inputType: 'text' | 'email' | 'password' | 'number';
  valueAsNumber?: boolean;
  withStrengthMeter?: boolean;
}

interface RadioField extends BaseField {
  type: 'radio';
  options: { value: string; label: string; id: string }[];
}

interface CountryField extends BaseField {
  type: 'country';
}

interface FileField extends BaseField {
  type: 'file';
  accept: string;
}

interface CheckboxField extends BaseField {
  type: 'checkbox';
}

export type FieldConfig = InputField | RadioField | CountryField | FileField | CheckboxField;

export const formFields: FieldConfig[] = [
  { type: 'input', name: 'name', id: 'rhf-name', label: 'Name', inputType: 'text' },
  { type: 'input', name: 'email', id: 'rhf-email', label: 'Email', inputType: 'email' },
  {
    type: 'input',
    name: 'password',
    id: 'rhf-password',
    label: 'Password',
    inputType: 'password',
    withStrengthMeter: true,
  },
  {
    type: 'input',
    name: 'confirmPassword',
    id: 'rhf-confirm-password',
    label: 'Confirm password',
    inputType: 'password',
  },
  { type: 'country', name: 'country', id: 'rhf-country', label: 'Country' },
  {
    type: 'input',
    name: 'age',
    id: 'rhf-age',
    label: 'Age',
    inputType: 'number',
    valueAsNumber: true,
  },
  {
    type: 'radio',
    name: 'gender',
    id: 'rhf-gender',
    label: 'Gender',
    options: [
      { value: 'male', label: 'Male', id: 'rhf-gender-male' },
      { value: 'female', label: 'Female', id: 'rhf-gender-female' },
    ],
  },
  {
    type: 'file',
    name: 'image',
    id: 'rhf-image',
    label: 'Profile image',
    accept: ACCEPTED_IMAGE_TYPES.join(','),
  },
  { type: 'checkbox', name: 'terms', id: 'rhf-terms', label: 'I accept the terms and conditions' },
];
