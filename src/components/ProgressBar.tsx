import React from 'react';

export type ProgressBarProps = {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100, className = '', showLabel = false }) => {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`w-full h-4 bg-slate-200 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-blue-500 transition-all duration-300"
        style={{ width: `${percent}%` }}
      />
      {showLabel && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold text-blue-700">
          {Math.round(percent)}%
        </span>
      )}
    </div>
  );
};
