import React from 'react';

export type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  label?: string;
};

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, className = '', label }) => (
  <label className={`flex items-center gap-2 cursor-pointer select-none ${className}`}>
    <div className={`relative w-10 h-6`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="sr-only"
      />
      <div className={`absolute inset-0 rounded-full transition bg-slate-300 ${checked ? 'bg-blue-500' : ''}`}></div>
      <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : ''}`}></div>
    </div>
    {label && <span className="text-slate-700 text-sm">{label}</span>}
  </label>
);
