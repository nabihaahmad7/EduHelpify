'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { lightTheme } from '@/theme/theme';

export const Authbutton = ({
  isLoading,
  text,
  onClick,
  type = 'button',
  className = '',
  disabled = false
}) => {
  const { theme = lightTheme } = useTheme();

  return (
    <button
      type={type}
      className={`w-full py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98] rounded-button whitespace-nowrap cursor-pointer ${className}`}
      style={{
        background: `linear-gradient(to right, ${theme.colors.gradientFrom}, ${theme.colors.gradientTo})`,
        color: theme.colors.buttonText,
        opacity: disabled ? 0.7 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
      onClick={onClick}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <div className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            style={{ color: theme.colors.buttonText }}
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {text}...
        </div>
      ) : (
        text
      )}
    </button>
  );
};