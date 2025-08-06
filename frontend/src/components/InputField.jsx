import React from 'react';

const InputField = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  error = '',
  required = false,
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-text mb-1"
        >
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-2 rounded-xl font-sans shadow-input border ${
          error ? 'border-danger' : 'border-gray-300'
        } focus:outline-none focus:ring-2 focus:ring-primary`}
      />
      {error && (
        <p className="text-danger text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default InputField;
