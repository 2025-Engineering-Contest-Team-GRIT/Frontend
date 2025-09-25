// src/components/Toast.tsx
import React, { useEffect } from "react";
import { IconCheck, IconX } from "./common";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  duration = 2500,
  onClose,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeStyles = {
    success:
      "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-2 border-emerald-300/50",
    error: "bg-gradient-to-r from-rose-500 to-red-600 text-white border-2 border-rose-300/50",
    info: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-2 border-blue-300/50",
  };
  const icon = type === "success" ? <IconCheck /> : type === "error" ? <IconX /> : null;

  return (
    <div
      className={`fixed bottom-8 right-8 z-50 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-lg flex items-center gap-3 ${typeStyles[type]} animate-fade-up hover:scale-105 transition-all duration-300`}
    >
      {icon && (
        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
          <span className="w-4 h-4">{icon}</span>
        </div>
      )}
      <span className="font-semibold text-lg">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          <IconX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
