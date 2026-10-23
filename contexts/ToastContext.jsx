"use client";

import { createContext, useContext, useState } from "react";
import { X, Check } from "lucide-react";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);

    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (message) => addToast(message, "success");
  const error = (message) => addToast(message, "error");
  const info = (message) => addToast(message, "info");

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}

      {/* Toast Container — ink pill under the header */}
      <div
        role="status"
        aria-live="polite"
        className="fixed top-[76px] inset-x-4 z-[100] flex flex-col items-center gap-2 pointer-events-none"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="mb-toast flex items-center justify-center gap-2 w-full max-w-[400px] min-h-[48px] px-[18px] py-2.5 rounded-full bg-ink text-white text-sm font-medium text-center shadow-float"
          >
            {toast.type === "error" && (
              <X className="w-4 h-4 shrink-0" aria-hidden="true" />
            )}
            {toast.type === "success" && (
              <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
