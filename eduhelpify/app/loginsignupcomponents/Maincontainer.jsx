'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { lightTheme } from '@/theme/theme';

export const AuthFormContainer = ({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkHref
}) => {
  const { theme = lightTheme } = useTheme();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div
        className={`w-full max-w-sm md:max-w-md transition-all duration-700 ease-in-out ${
          showForm ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Header Section */}
        <div
          className={`text-center mb-6 transition-all duration-700 delay-300 ease-in-out ${
            showForm ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <div className="flex justify-center mb-4">
            <img 
              src="/images/logo.png" 
              alt="EduHelpify" 
              className="h-10 w-auto md:h-12" 
            />
          </div>
          <h1 
            className="text-2xl font-bold mb-2"
            style={{ color: theme.colors.text }}
          >
            {title}
          </h1>
          <p className="text-sm md:text-base" style={{ color: theme.colors.placeholder }}>
            {subtitle}
          </p>
        </div>

        {/* Form Card */}
        <div
          className={`rounded-xl shadow-lg p-6 transition-all duration-700 delay-500 ease-in-out ${
            showForm ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{ 
            backgroundColor: theme.colors.cardBg,
            border: `1px solid ${theme.colors.border}`,
            maxWidth: '380px',
            margin: '0 auto'
          }}
        >
          {children}

          {/* Footer Link */}
          {footerText && (
            <div
              className={`text-center mt-6 transition-all duration-700 delay-700 ease-in-out ${
                showForm ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <p className="text-sm md:text-base" style={{ color: theme.colors.placeholder }}>
                {footerText}{' '}
                <a
                  href={footerLinkHref}
                  className="font-medium hover:underline"
                  style={{ color: theme.colors.primary }}
                >
                  {footerLinkText}
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};