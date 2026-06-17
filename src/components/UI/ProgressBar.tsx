import React from 'react';

interface ProgressBarProps {
  progress: number;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'primary',
  height = 'md',
  showLabel = false,
}) => {
  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
  };

  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const safeProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm text-text-secondary mb-1">
          <span>进度</span>
          <span>{safeProgress.toFixed(0)}%</span>
        </div>
      )}
      <div className={`w-full bg-bg-tertiary rounded-full ${heightClasses[height]}`}>
        <div
          className={`${colorClasses[color]} ${heightClasses[height]} rounded-full transition-all duration-300`}
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </div>
  );
};
