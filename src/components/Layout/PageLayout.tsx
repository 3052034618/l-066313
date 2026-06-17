import React from 'react';
import { BottomNav } from './BottomNav';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  showNav?: boolean;
  rightAction?: React.ReactNode;
  onBack?: () => void;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  showNav = true,
  rightAction,
  onBack,
}) => {
  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      {(title || onBack) && (
        <header className="sticky top-0 z-40 bg-white border-b border-border">
          <div className="max-w-lg mx-auto h-14 flex items-center justify-between px-4">
            <div className="flex items-center">
              {onBack && (
                <button
                  onClick={onBack}
                  className="mr-2 p-1 -ml-1 text-text-secondary hover:text-text-primary"
                >
                  ←
                </button>
              )}
              {title && <h1 className="text-lg font-semibold text-text-primary">{title}</h1>}
            </div>
            {rightAction && <div>{rightAction}</div>}
          </div>
        </header>
      )}
      <main className="max-w-lg mx-auto px-4 py-4">{children}</main>
      {showNav && <BottomNav />}
    </div>
  );
};
