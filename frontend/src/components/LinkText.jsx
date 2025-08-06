import React from 'react';
import { Link } from 'react-router-dom';

const LinkText = ({ to, text, external = false }) => {
  const baseClass =
    "text-primary font-sans underline hover:text-primaryDark transition duration-150 ease-in-out";

  if (external) {
    return (
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClass}
      >
        {text}
      </a>
    );
  }

  return <Link to={to} className={baseClass}>{text}</Link>;
};

export default LinkText;
