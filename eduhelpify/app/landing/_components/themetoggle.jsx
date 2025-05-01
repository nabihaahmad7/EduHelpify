'use client'
import { useTheme } from '../../../contexts/ThemeContext';    
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full focus:outline-none"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <FontAwesomeIcon 
        icon={isDarkMode ? faSun : faMoon} 
        className={`text-xl ${isDarkMode ? 'text-yellow-400' : 'text-gray-700'}`}
      />
    </button>
  );
}