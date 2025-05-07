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
<header 
  className={`h-20 shadow-md flex items-center justify-between px-4 sm:px-6 fixed top-0 left-0 right-0 z-50 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} transition-all duration-300`}
>
  {/* Left: Logo + Hamburger */}
  <div className="flex items-center space-x-4">
    
    {/* Mobile: Hamburger Menu */}
    <button className="md:hidden" onClick={toggleSidebar}>
      <FontAwesomeIcon icon={faBars} className="text-2xl" style={{ color: theme.colors.icon }} />
    </button>

    {/* Logo */}
    <img
      src="/images/logo.png"
      alt="Logo"
      className="h-8 sm:h-10 object-contain"
    />
  </div>

  {/* Right: Theme + User Info + Logout */}
  <div className="flex items-center space-x-3 sm:space-x-4">
    <ThemeToggle />

    {/* Username */}
    <span
      className="hidden sm:inline-block text-sm sm:text-base font-medium"
      style={{ color: theme.colors.text }}
    >
      {userData.name}
    </span>

    {/* Avatar */}
    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-gray-400 flex items-center justify-center">
      {userData.profilePic ? (
        <img
          src={userData.profilePic}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) : (
        <FontAwesomeIcon icon={faUser} className="text-white text-lg" />
      )}
    </div>

    {/* Logout Button */}
    <button
      onClick={handleLogout}
      className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors"
      style={{
        backgroundColor: theme.colors.primary,
        color: theme.colors.buttonText
      }}
    >
      <FontAwesomeIcon icon={faSignOutAlt} className="mr-1" />
      Logout
    </button>
  </div>
</header>


  );
}