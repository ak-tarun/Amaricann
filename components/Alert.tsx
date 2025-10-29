
import React from 'react';

interface AlertProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ message, type = 'info', onClose, className = '' }) => {
  const baseStyles = 'p-3 rounded-md flex justify-between items-center text-sm';
  const typeStyles = {
    success: 'bg-green-100 border border-green-400 text-green-700',
    error: 'bg-red-100 border border-red-400 text-red-700',
    info: 'bg-blue-100 border border-blue-400 text-blue-700',
    warning: 'bg-yellow-100 border border-yellow-400 text-yellow-700',
  };

  return (
    <div className={`${baseStyles} ${typeStyles[type]} ${className}`} role="alert">
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 p-1 -my-1.5 -mr-1.5 rounded-md hover:bg-opacity-50"
          style={{ color: typeStyles[type].match(/text-(\w+)-/)![0].replace('text-', '') }}
          aria-label="Close alert"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;
