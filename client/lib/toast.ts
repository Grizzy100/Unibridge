// client/src/lib/toast.ts
import toast from 'react-hot-toast';

// Success toast
export const showSuccess = (message: string) => {
  toast.success(message, {
    duration: 4000,
  });
};

// Error toast
export const showError = (message: string) => {
  toast.error(message, {
    duration: 5000,
  });
};

// Loading toast (returns ID to dismiss later)
export const showLoading = (message: string) => {
  return toast.loading(message);
};

// Dismiss specific toast
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

// Promise-based toast (auto handles loading/success/error)
export const showPromise = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) => {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  });
};

// Info toast (custom)
export const showInfo = (message: string) => {
  toast(message, {
    icon: 'ℹ️',
    style: {
      background: '#3b82f6',
      color: '#fff',
    },
  });
};

// Warning toast (custom)
export const showWarning = (message: string) => {
  toast(message, {
    icon: '⚠️',
    style: {
      background: '#f59e0b',
      color: '#fff',
    },
  });
};
