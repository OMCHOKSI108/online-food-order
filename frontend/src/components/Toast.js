import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`toast show bg-${toast.type === 'error' ? 'danger' : 
              toast.type === 'success' ? 'success' : 
              toast.type === 'warning' ? 'warning' : 'info'}`}
            role="alert"
          >
            <div className="toast-body text-white">
              {toast.message}
              <button
                type="button"
                className="btn-close btn-close-white float-end"
                onClick={() => removeToast(toast.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};