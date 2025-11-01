import { useState, useCallback } from 'react';
import { useToast } from '../components/Toast';

export const useApiRequest = (apiFunction, { showSuccessToast = false, successMessage = '' } = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFunction(...args);
      if (showSuccessToast) {
        addToast(successMessage || 'Operation successful!', 'success');
      }
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Something went wrong';
      setError(errorMessage);
      addToast(errorMessage, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, addToast, showSuccessToast, successMessage]);

  const retry = useCallback(async (...args) => {
    return execute(...args);
  }, [execute]);

  return {
    loading,
    error,
    execute,
    retry
  };
};