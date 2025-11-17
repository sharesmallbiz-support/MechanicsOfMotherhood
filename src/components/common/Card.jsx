import React from 'react';

const Card = ({ children, className = '', onClick, hoverable = false }) => {
  const hoverStyles = hoverable
    ? 'hover:shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer'
    : '';

  // If card is clickable, make it accessible
  const handleKeyDown = (e) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(e);
    }
  };

  const clickableProps = onClick
    ? {
        role: 'button',
        tabIndex: 0,
        onKeyDown: handleKeyDown,
        onClick,
      }
    : {};

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 ${hoverStyles} ${className}`}
      {...clickableProps}
    >
      {children}
    </div>
  );
};

export default Card;
