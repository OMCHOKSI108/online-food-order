import React from 'react';

export const LoadingSpinner = ({ size = 'medium', light = false }) => {
  const spinnerSizes = {
    small: 'spinner-border-sm',
    medium: '',
    large: 'spinner-border-lg'
  };

  return (
    <div className="d-flex justify-content-center align-items-center p-3">
      <div 
        className={`spinner-border ${spinnerSizes[size]} ${light ? 'text-light' : 'text-primary'}`}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export const PageLoader = () => (
  <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75" style={{ zIndex: 1050 }}>
    <div className="text-center">
      <LoadingSpinner size="large" />
      <p className="mt-2">Loading...</p>
    </div>
  </div>
);

export const LoadingOverlay = ({ children, loading, light = false }) => {
  if (!loading) return children;

  return (
    <div className="position-relative">
      {children}
      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-25">
        <LoadingSpinner light={light} />
      </div>
    </div>
  );
};