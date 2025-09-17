'use client';

import React, { useState, useEffect } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import NotificationCenter from './NotificationCenter';

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/notifications/stats');
      const data = await response.json();
      
      if (data.success) {
        setUnreadCount(data.data.unread);
      }
    } catch (error) {
      console.error('Failed to fetch notification stats:', error);
    }
  };

  const handleBellClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={handleBellClick}
        className="relative rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Notifications"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <NotificationCenter isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default NotificationBell;
