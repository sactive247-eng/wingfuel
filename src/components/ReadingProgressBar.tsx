import React, { useState, useEffect } from 'react';

interface ReadingProgressBarProps {
  targetSelector?: string;
  className?: string;
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({
  targetSelector = 'main',
  className = ''
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const targetEl = document.querySelector(targetSelector) || document.documentElement;
      const rect = targetEl.getBoundingClientRect();
      const elementHeight = targetEl.scrollHeight || document.documentElement.scrollHeight;
      const visibleHeight = window.innerHeight;

      const totalScrollable = elementHeight - visibleHeight;

      if (totalScrollable > 0) {
        const currentScroll = window.scrollY || window.pageYOffset;
        const currentProgress = (currentScroll / totalScrollable) * 100;
        setProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial position check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [targetSelector]);

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 h-1 bg-slate-900/80 backdrop-blur-xs ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 transition-all duration-75 shadow-[0_0_10px_rgba(249,115,22,0.8)]"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
};
