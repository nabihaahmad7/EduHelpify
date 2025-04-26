'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { lightTheme } from '@/theme/theme';

export const FormInput = ({
  type = 'text',
  id,
  value,
  onChange,
  label,
  icon,
  placeholder = '',
  hasError = false,
  errorMessage = '',
  showPasswordToggle = false,
  onTogglePassword
}) => {
  const { theme = lightTheme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="mb-5 relative">
      <div className="relative">
        <input
          type={type}
          id={id}
          className={`w-full px-4 py-3 pl-10 rounded-lg focus:outline-none transition-all duration-300 ${
            hasError && !value ? 'border-error' : ''
          }`}
          style={{
            color: theme.colors.inputText || theme.colors.text,
            backgroundColor: theme.colors.cardBg,
            border: `1px solid ${
              hasError && !value
                ? theme.colors.errorBorder || theme.colors.error
                : isFocused
                ? theme.colors.focusBorder || theme.colors.primary
                : theme.colors.inputBorder || theme.colors.border
            }`,
            fontFamily: theme.fonts?.input || 'inherit',
            paddingRight: showPasswordToggle ? '2.5rem' : '1rem',
          }}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          placeholder={placeholder}
          suppressHydrationWarning={true}
        />

        <label
          htmlFor={id}
          className={`absolute left-10 transition-all duration-300 pointer-events-none ${
            isFocused || value
              ? 'text-xs -top-2.5 px-1'
              : 'top-3'
          }`}
          style={{
            color: isFocused || value
              ? theme.colors.focusBorder || theme.colors.primary
              : theme.colors.placeholder || '#afafaf',
            backgroundColor: theme.colors.cardBg,
          }}
        >
          {label}
        </label>

        <div 
          className="absolute left-4 top-4"
          style={{ 
            color: isFocused 
              ? theme.colors.focusBorder || theme.colors.primary 
              : theme.colors.icon || theme.colors.placeholder 
          }}
        >
          {icon}
        </div>

        {showPasswordToggle && (
          <button
            type="button"
            className="absolute right-4 top-4 cursor-pointer"
            onClick={onTogglePassword}
            style={{ 
              color: isHovered || isFocused
                ? theme.colors.focusBorder || theme.colors.primary
                : theme.colors.icon || theme.colors.placeholder 
            }}
          >
            {type === 'password' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {hasError && errorMessage && (
        <div className="mt-2 text-sm flex items-start" style={{ color: theme.colors.error }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};