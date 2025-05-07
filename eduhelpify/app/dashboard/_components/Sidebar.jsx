"use client";

import { useTheme } from '../../../contexts/ThemeContext';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faCog
} from '@fortawesome/free-solid-svg-icons';
import { usePathname } from 'next/navigation';

export default function Sidebar({ isSidebarVisible, toggleSidebar }) {
  const { theme, isDarkMode } = useTheme();
  const pathname = usePathname();

  // Only close sidebar on mobile when a link is clicked
  const handleLinkClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  // Don't render if sidebar is hidden
  if (!isSidebarVisible) return null;

  return (
    <aside className={`w-64 pt-20 fixed left-0 top-0 h-full shadow-lg flex flex-col z-40 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} transition-all`}>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard"
              onClick={handleLinkClick}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${pathname === '/dashboard' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
            >
              <FontAwesomeIcon icon={faTachometerAlt} className="w-5" style={{ color: theme.colors.icon }} />
              <span>New Task</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/settings"
              onClick={handleLinkClick}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${pathname === '/dashboard/settings' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
            >
              <FontAwesomeIcon icon={faCog} className="w-5" style={{ color: theme.colors.icon }} />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
