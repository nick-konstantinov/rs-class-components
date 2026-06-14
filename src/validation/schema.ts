import { z } from 'zod';
import { COUNTRIES } from '@/data/countries';
import { isEmailValid } from '@/utils/email';

export const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg'];

export const formSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Name is required')
      .refine((value) => value.charAt(0) === value.charAt(0).toUpperCase(), {
        message: 'Name must start with an uppercase letter',
      }),
    age: z
      .number({ message: 'Age is required' })
      .int('Age must be a whole number')
      .min(1, 'Age must be positive')
      .max(120, 'Age looks too large'),
    email: z.string().trim().min(1, 'Email is required').refine(isEmailValid, {
      message: 'Invalid email',
    }),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .refine((value) => /[a-z]/.test(value), { message: 'Add a lowercase letter' })
      .refine((value) => /[A-Z]/.test(value), { message: 'Add an uppercase letter' })
      .refine((value) => /\d/.test(value), { message: 'Add a number' })
      .refine((value) => /[^A-Za-z0-9]/.test(value), { message: 'Add a special character' }),
    confirmPassword: z.string().min(1, 'Confirm your password'),
    gender: z.enum(['male', 'female'], { message: 'Select a gender' }),
    terms: z.literal(true, { message: 'You must accept the terms' }),
    country: z.string().refine((value) => COUNTRIES.includes(value), {
      message: 'Choose a country from the list',
    }),
    image: z
      .instanceof(File, { message: 'Upload an image' })
      .refine((file) => file.size > 0, { message: 'Upload an image' })
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: 'Only PNG or JPEG is allowed',
      })
      .refine((file) => file.size <= MAX_IMAGE_SIZE, { message: 'Image must be 2 MB or smaller' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type FormValues = z.infer<typeof formSchema>;
