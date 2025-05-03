"use client";

import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthContext';
import ThemeToggle from '../../landing/_components/themetoggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';

export default function Header({ toggleSidebar }) { // Accept toggleSidebar from DashboardLayout
  const { theme, isDarkMode } = useTheme();
  const { user, signOut } = useAuth();
  const [userData, setUserData] = useState({
    name: 'User', // Default name
    profilePic: '', // Default profile pic empty
  });

  useEffect(() => {
    // Update user data when auth user changes
    if (user) {
      setUserData({
        name: user.user_metadata?.full_name || user.email || 'User',
        profilePic:  '',
      });
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      // Call the logout API route
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to sign out');
      }
      
      // When successful, redirect to login page
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error.message);
      // You could add a toast notification here to show the error
    }
  };

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
            {userData.name}
          </span>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: theme.colors.primary }}>
            {userData.profilePic ? (
              <img src={userData.profilePic} alt="Profile" className="w-full h-full object-cover rounded-full" />
            ) : (
              <FontAwesomeIcon icon={faUser} className="text-lg" />
            )}
          </div>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.buttonText,
              borderRadius: '4px',
              padding: '2px',
              cursor:"pointer"
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