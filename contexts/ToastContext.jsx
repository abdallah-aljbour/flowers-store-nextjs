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

      {/* Toast Container */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto animate-slide-down bg-white rounded-lg shadow-xl border px-4 py-3 flex items-center gap-3 min-w-[280px] max-w-[400px]"
          >
            {toast.type === "success" && (
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-white" />
              </div>
            )}
            {toast.type === "error" && (
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <X className="w-5 h-5 text-white" />
              </div>
            )}
            {toast.type === "info" && (
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">i</span>
              </div>
            )}

            <span className="text-sm text-gray-900 font-medium flex-1">
              {toast.message}
            </span>

            <button
              onClick={() => removeToast(toast.id)}
              className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5 text-gray-600" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
