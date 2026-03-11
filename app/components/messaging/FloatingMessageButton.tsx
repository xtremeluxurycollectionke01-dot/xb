// components/messaging/FloatingMessageButton.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export default function FloatingMessageButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 5000);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Tooltip */}
      {showTooltip && (
        <div className="bg-white dark:bg-[var(--brand-800)] text-[var(--dark-text)] dark:text-[var(--light-text)] px-4 py-2 rounded-lg shadow-lg border border-[var(--card-border)] animate-slide-in-right">
          <p className="text-sm font-medium">Need help? Chat with us!</p>
          <div className="absolute bottom-0 right-4 w-3 h-3 bg-white dark:bg-[var(--brand-800)] transform rotate-45 translate-y-1/2 border-r border-b border-[var(--card-border)]"></div>
        </div>
      )}

      {/* FAB Button */}
      <Link
        href="/messaging"
        className="group relative flex items-center justify-center w-14 h-14 bg-[var(--brand-500)] hover:bg-[var(--brand-600)] text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:ring-offset-2 dark:focus:ring-offset-[var(--brand-900)]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <MessageCircle 
          size={24} 
          className={`transition-transform duration-300 ${isHovered ? 'rotate-12' : ''}`} 
        />
        
        {/* Ripple effect */}
        <span className="absolute inset-0 rounded-full bg-[var(--brand-500)] animate-ping opacity-20"></span>
        
        {/* Notification badge */}
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
          3
        </span>
      </Link>

      {/* Quick actions on hover */}
      {/*{isHovered && (
        <div className="absolute bottom-16 right-0 bg-white dark:bg-[var(--brand-800)] rounded-lg shadow-xl border border-[var(--card-border)] p-2 min-w-[200px] animate-slide-up">
          <p className="text-sm font-semibold text-[var(--dark-text)] dark:text-[var(--light-text)] px-3 py-2 border-b border-[var(--card-border)]">
            Quick Messages
          </p>
          <button className="w-full text-left px-3 py-2 text-sm text-[var(--dark-text)] dark:text-[var(--light-text)] hover:bg-[var(--soft-gray)] dark:hover:bg-[var(--brand-700)] rounded-md transition-colors">
            💬 Order inquiry
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-[var(--dark-text)] dark:text-[var(--light-text)] hover:bg-[var(--soft-gray)] dark:hover:bg-[var(--brand-700)] rounded-md transition-colors">
            📦 Shipping status
          </button>

        </div>
      )}*/}
    </div>
  );
}