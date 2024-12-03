import { FC } from 'react';
import '@/styles/addForm.css';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
  error?: string;
}

export const Select: FC<SelectProps> = ({
  id,
  label,
  name,
  value,
  options,
  error,
  onChange,
  ...restProps
}) => {
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
};