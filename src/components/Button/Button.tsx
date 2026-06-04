import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Button.module.scss';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

function Button({ variant = 'secondary', className, type = 'button', ...props }: ButtonProps) {
  const classes = clsx(styles.button, styles[variant], className);
  return <button {...props} type={type} className={classes} />;
}

export default Button;
