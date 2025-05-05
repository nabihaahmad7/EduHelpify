'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { signIn } from 'next-auth/react';
import { supabaseClient } from '../../lib/supabaseCient';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../landing/_components/themetoggle';

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { theme, isDarkMode } = useTheme();
  const handleSocialLogin = async (provider) => {
    try {
      // For Google auth with Supabase
      if (provider === 'google') {
        const { error } = await supabaseClient.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/api/auth/callback`
          }
        });
        
        if (error) {
          setErrorMessage(`Failed to sign in with ${provider}: ${error.message}`);
        }
      } else {
        // Fall back to next-auth for other providers if needed
        const result = await signIn(provider, { callbackUrl: '/dashboard' });
        
        if (result?.error) {
          setErrorMessage(`Failed to sign in with ${provider}`);
        }
      }
    } catch (error) {
      setErrorMessage(`Failed to sign in with ${provider}`);
    }
  };
  
  return (
    <div className="min-h-screen flex">
      {/* First Column - Login Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md text-center">
          {/* Header */}
          <div className="mb-8" style={{ backgroundColor: theme.colors.background ,color: theme.colors.text }}>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2" style={{ color: theme.colors.text }}>EduHelpify</h1>
            <p className="text-2xl text-gray-700 dark:text-gray-200" style={{ color: theme.colors.text }}>the Ultimate Educational Assistant App</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-4" style={{ color: theme.colors.text }}>to help you get things done in seconds</p>
          </div>
          
          {/* Card with Sign-In Button */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6" style={{ backgroundColor: theme.colors.authBg, color: theme.colors.authText }}>
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm" style={{ backgroundColor: theme.colors.authBg, color: theme.colors.authText }}>
                {errorMessage}
              </div>
            )}
            
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              style={{ backgroundColor: theme.colors.authButton, color: theme.colors.authButtonText }}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <FontAwesomeIcon icon={faGoogle} className="text-[#DB4437]" />
              <span className="text-gray-700 dark:text-gray-200" style={{ color: theme.colors.authText }}>
                {isLoading ? "Signing in..." : "Sign in with Google"}
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Second Column - Background with Theme Toggle */}
      <div className="w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 relative">
        <div className="absolute top-6 right-6">
          {/* <ThemeToggle /> */}
        </div>
      </div>
    </div>
  );
}