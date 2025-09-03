// src/styles/theme.ts
// 공통 색상/타이포/버튼 스타일 시스템

export const colors = {
  primary: '#3b82f6', // blue-500
  secondary: '#64748b', // slate-500
  success: '#10b981', // emerald-500
  danger: '#ef4444', // red-500
  warning: '#f59e42', // amber-500
  info: '#0ea5e9', // sky-500
  background: '#f8fafc', // slate-50
  card: '#ffffff',
};

export const fontSizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
};

export const buttonStyles = {
  base: 'px-4 py-2 rounded-lg font-semibold transition-colors',
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700',
};
