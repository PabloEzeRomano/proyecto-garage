import { FC, useEffect } from 'react';
import '@/styles/addForm.css';

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
  label: string;
  error?: string;
  options?: string[];
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
  onChange,
  options,
  ...restProps
}) => {
  useEffect(() => {
    if (error) {
      console.error(`Input error for ${name || id}: ${error}`);
    }
  }, [error, name, id]);

  if (type === 'select' && options) {
    return (
      <div className="input-container">
        <label htmlFor={name} className="input-label">
          {label}
        </label>
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={`add-input ${error ? 'error' : ''}`}
          {...restProps}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {error && <span className="error-message absolute">{error}</span>}
      </div>
    );
  }

  return (
    <div className="input-container">
      <label htmlFor={name} className="input-label">
        {label}
      </label>
      <input
        type={type}
        id={id}
        className={`add-input${error ? ' error' : ''}${
          className ? ` ${className}` : ''
        }`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        {...restProps}
      />
      {error && <span className="error-message absolute">{error}</span>}
    </div>
  );
};
