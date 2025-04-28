"use client";

import { useTheme } from '@/contexts/ThemeContext';
import Header from './_components/Header';
import Sidebar from './_components/Sidebar';
import { useState } from 'react';

export default function DashboardLayout({ children }) {
  const { isDarkMode } = useTheme();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        {/* Pass sidebarVisible and toggleSidebar to Sidebar */}
        <Sidebar isSidebarVisible={sidebarVisible} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
