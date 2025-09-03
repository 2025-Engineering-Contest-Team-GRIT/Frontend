// src/components/Toast.tsx
import React, { useEffect } from 'react';
import { IconCheck, IconX } from './common';
import { fadeIn, shake } from './animations';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 2500, onClose }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white',
    info: 'bg-blue-600 text-white',
  };
  const icon = type === 'success' ? <IconCheck /> : type === 'error' ? <IconX /> : null;

  return (
    <div className={`fixed bottom-8 right-8 z-50 px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 ${typeStyles[type]} animate-fade-in`}>
      {icon && <span className="w-5 h-5">{icon}</span>}
      <span className="font-semibold">{message}</span>
      <button onClick={onClose} className="ml-2 text-white/80 hover:text-white animate-shake">
        <IconX />
      </button>
    </div>
  );
};
