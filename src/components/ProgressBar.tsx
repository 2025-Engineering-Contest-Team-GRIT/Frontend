import React from "react";

export type ProgressBarProps = {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  className = "",
  showLabel = false,
}) => {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={`relative w-full h-4 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full overflow-hidden shadow-inner ${className}`}
    >
      <div
        className="h-full bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 rounded-full transition-all duration-1000 ease-out animate-pulse shadow-lg"
        style={{
          width: `${percent}%`,
          background:
            percent > 80
              ? "linear-gradient(90deg, #10b981, #059669)"
              : percent > 50
                ? "linear-gradient(90deg, #3b82f6, #6366f1)"
                : "linear-gradient(90deg, #f59e0b, #d97706)",
        }}
      />
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-slate-700 bg-white/80 px-2 py-1 rounded-full shadow-sm">
            {Math.round(percent)}%
          </span>
        </div>
      )}
      {/* Progress glow effect */}
      <div
        className="absolute top-0 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full transition-all duration-1000"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};
