// components/PrimaryButton.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PrimaryButton = ({ text, to, onClick, external = false, type = "button", className = "" }) => {
  const baseStyles =
    'inline-block bg-background text-primary-foreground font-sans rounded-lg px-4 py-2 hover:bg-primary transition duration-200 ' + className;

  if (to) {
    return external ? (
      <a href={to} className={baseStyles} target="_blank" rel="noopener noreferrer">
        {text}
      </a>
    ) : (
      <Link to={to} className={baseStyles}>
        {text}
      </Link>
    );
  }

  return (
    <button onClick={onClick} type={type} className={baseStyles}>
      {text}
    </button>
  );
};

export default PrimaryButton;

