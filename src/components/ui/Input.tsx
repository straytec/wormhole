import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-stellar-200 mb-2">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 
          bg-cosmic-800 border border-cosmic-600 
          rounded-lg text-white placeholder-cosmic-400
          focus:outline-none focus:ring-2 focus:ring-stellar-500 focus:border-transparent
          transition-all duration-200
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};