"use client";

import { useTheme } from '../../contexts/ThemeContext';
import Header from './_components/Header';
import Sidebar from './_components/Sidebar';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

export default function DashboardLayout({ children }) {
  const { isDarkMode } = useTheme();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
      {/* Fixed Header */}
      <header className={`fixed top-0 left-0 right-0 z-20 h-16 shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <Header toggleSidebar={toggleSidebar} />
      </header>

      <div className="flex flex-1 pt-16"> {/* pt-16 to account for fixed header */}
        {/* Fixed Sidebar */}
        <aside className={`fixed top-16 bottom-0 z-10 w-64 shadow-lg transition-transform duration-300 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } ${
          isMobile ? (sidebarVisible ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
        }`}>
          <Sidebar isSidebarVisible={true} toggleSidebar={toggleSidebar} />
        </aside>

        {/* Main Content Area */}
        <main className={`flex-1 transition-margin duration-300 ${
  isMobile ? (sidebarVisible ? 'ml-64' : 'ml-0') : 'ml-64'
}`}>
  <div className="p-4 md:p-6 h-full">
    <div className="h-full">
      {children}
    </div>
  </div>
</main>

        {/* Mobile Overlay */}
        {isMobile && sidebarVisible && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-0"
            onClick={toggleSidebar}
          />
        )}
      </div>
    </div>
  );
}
