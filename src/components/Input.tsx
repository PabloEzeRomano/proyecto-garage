import { FC, useEffect } from 'react';

import '@/styles/addForm.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  id?: string;
  placeholder?: string;
  label: string;
  name?: string;
  error?: string;
  className?: string;
}

export const Input: FC<InputProps> = ({
  type,
  id,
  placeholder,
  label,
  value,
  name,
  error,
  className,
  ...restProps
}) => {
  useEffect(() => {
    if (error) {
      console.error(`Input error for ${name || id}: ${error}`);
    }
  }, [error, name, id]);

  return (
    <div className="input-container relative">
      <label className="input-label">{label}</label>
      <input
        type={type}
        id={id}
        className={`add-input ${error ? 'error' : ''} ${className || ''}`}
        placeholder={placeholder}
        value={value}
        name={name}
        {...restProps}
      />
      {error && <span className="error-message absolute">{error}</span>}
    </div>
  );
};
