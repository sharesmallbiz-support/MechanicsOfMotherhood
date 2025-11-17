import React from 'react';

const Card = ({ children, className = '', onClick, hoverable = false }) => {
  const hoverStyles = hoverable
    ? 'hover:shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer'
    : '';

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
