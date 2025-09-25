import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, id, error, className = '', ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-text text-sm font-medium mb-2">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full p-3 bg-surface border ${error ? 'border-error' : 'border-border'} rounded-lg text-text placeholder-textSecondary focus:outline-none focus:ring-2 ${error ? 'focus:ring-error' : 'focus:ring-primary'} transition-all duration-200 ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-error text-sm">{error}</p>}
    </div>
  );
};

export default Input;
