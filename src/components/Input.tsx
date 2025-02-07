import { FC, useCallback, useEffect } from 'react';
import '@/styles/addForm.css';

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: Array<{ value: string; label: string }> | string[] | number[];
  removeMargin?: boolean;
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
  removeMargin,
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
      <div className={`${removeMargin ? '' : 'input-container'}`}>
        {label && (
          <label htmlFor={name} className="input-label">
            {label}
          </label>
        )}
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={`select-input ${error ? 'error' : ''} ${className || ''}`}
          {...restProps}
        >
          <option value="">Seleccionar {label}</option>
          {options.map((option) => {
            if (typeof option === 'string' || typeof option === 'number') {
              return (
                <option key={option} value={option}>
                  {option}
                </option>
              );
            }
            return (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            );
          })}
        </select>
        {error && <span className="error-message absolute">{error}</span>}
      </div>
    );
  }

  const handleCheckboxClick = useCallback(() => {
    if (restProps.disabled) {
      return;
    }
    if (onChange) {
      onChange({
        target: {
          checked: !restProps.checked,
          type: 'checkbox',
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  }, [onChange, restProps.checked]);

  return (
    <div
      className={`${
        type === 'checkbox'
          ? 'flex items-center gap-2 cursor-pointer'
          : removeMargin
          ? ''
          : 'input-container'
      }`}
      onClick={type === 'checkbox' ? handleCheckboxClick : undefined}
    >
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        className={`add-input${error ? ' error' : ''}${
          className ? ` ${className}` : ''
        }${type === 'checkbox' ? ' flex-1' : ''}`}
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
