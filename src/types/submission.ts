export type FormSource = 'rhf' | 'uncontrolled';

export interface Submission {
  id: string;
  source: FormSource;
  name: string;
  age: number;
  email: string;
  gender: string;
  terms: boolean;
  country: string;
  image: string | null;
  createdAt: number;
}
