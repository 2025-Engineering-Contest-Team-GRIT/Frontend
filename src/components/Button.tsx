import React from 'react';

export type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
};

const baseStyle = 'py-2 px-4 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2';
const variants: Record<string, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-200',
  secondary: 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80 focus:ring-blue-200',
  danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 focus:ring-red-200',
  outline: 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  variant = 'primary',
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
  >
    {children}
  </button>
);
