"use client";

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '../../landing/_components/themetoggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';

export default function Header({ toggleSidebar }) { // Accept toggleSidebar from DashboardLayout
  const { theme, isDarkMode } = useTheme();
  const [user, setUser] = useState({
    name: 'John Doe', // Default name
    profilePic: '', // Default profile pic empty
  });

  // Fetch user data
  const fetchUserData = async () => {
    const response = await fetch('/api/getUser'); // Replace with your actual API endpoint
    const data = await response.json();
    setUser({
      name: data.name || 'John Doe',
      profilePic: data.profilePic || '',
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <header className={`h-16 shadow-md flex items-center justify-between px-4 md:px-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <button className="md:hidden" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} className="text-2xl" style={{ color: theme.colors.icon }} />
      </button>
      <div className="text-xl font-semibold" style={{ color: theme.colors.text }}>
        Dashboard
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <div className="flex items-center space-x-3">
          <span className="hidden md:block" style={{ color: theme.colors.text }}>
            {user.name}
          </span>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: theme.colors.primary }}>
            {user.profilePic ? (
              <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover rounded-full" />
            ) : (
              <FontAwesomeIcon icon={faUser} className="text-lg" />
            )}
          </div>
          <button
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.buttonText,
              borderRadius: '4px',
              padding: '2px',
            }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-1" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
