"use client";

import { useTheme } from '../../../contexts/ThemeContext';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, 
  faFile, 
  faCog 
} from '@fortawesome/free-solid-svg-icons';
import { usePathname } from 'next/navigation';

export default function Sidebar({ isSidebarVisible, toggleSidebar }) {
  const { theme, isDarkMode } = useTheme();
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (window.innerWidth < 768) { 
      toggleSidebar(); // Close the sidebar
    }
  };

  return (
    <aside className={`w-64 shadow-lg flex flex-col ${isDarkMode ? 'bg-gray-800' : 'bg-white'} ${isSidebarVisible ? 'block' : 'hidden'} md:block`}>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link 
              href="/dashboard" 
              className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 ${pathname === '/dashboard' ? 'bg-gray-600' : ''}`} 
              onClick={handleLinkClick} // Close sidebar on click
            >
              <FontAwesomeIcon icon={faTachometerAlt} className="w-5" style={{ color: theme.colors.icon }} />
              <span>New Task</span>
            </Link>
          </li>
          <li>
            {/* <Link 
              href="/dashboard/myfiles" 
              className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 ${pathname === '/dashboard/myfiles' ? 'bg-gray-600' : ''}`} 
              onClick={handleLinkClick} // Close sidebar on click
            >
              <FontAwesomeIcon icon={faFile} className="w-5" style={{ color: theme.colors.icon }} />
              <span>My Files</span>
            </Link> */}
          </li>
          <li>
            <Link 
              href="/dashboard/settings" 
              className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 ${pathname === '/dashboard/settings' ? 'bg-gray-600' : ''}`} 
              onClick={handleLinkClick} // Close sidebar on click
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
