import React, { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  id: string;
  options: { value: string; label: string }[];
  error?: string;
}

const Select: React.FC<SelectProps> = ({ label, id, options, error, className = '', ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-text text-sm font-medium mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={`block w-full p-3 bg-surface border ${error ? 'border-error' : 'border-border'} rounded-lg text-text appearance-none focus:outline-none focus:ring-2 ${error ? 'focus:ring-error' : 'focus:ring-primary'} transition-all duration-200 ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-textSecondary">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-error text-sm">{error}</p>}
    </div>
  );
};

export default Select;
