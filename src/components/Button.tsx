import React from "react";

export type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "danger" | "outline";
};

const baseStyle =
  "py-3 px-6 rounded-xl font-bold transition-all duration-300 focus:outline-none focus:ring-4 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl";
const variants: Record<string, string> = {
  primary:
    "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 focus:ring-blue-300/50 ",
  secondary:
    "bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 focus:ring-slate-200/50 backdrop-blur-sm",
  danger:
    "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 focus:ring-red-300/50",
  outline:
    "bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-white border-2 border-slate-300 hover:border-slate-400 focus:ring-slate-200/50",
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  variant = "primary",
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`${baseStyle} ${variants[variant]} ${
      disabled ? "opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-lg" : ""
    } ${className}`}
  >
    {children}
  </button>
);
