'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { signIn } from 'next-auth/react';
import { supabaseClient } from '../../lib/supabaseCient';
import { useTheme } from '../../contexts/ThemeContext';

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { theme } = useTheme();

  const handleSocialLogin = async (provider) => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      if (provider === 'google') {
        const { error } = await supabaseClient.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/api/auth/callback`
          }
        });
        
        if (error) throw error;
      } else {
        
        const result = await signIn(provider, { callbackUrl: '/dashboard' });
        if (result?.error) throw new Error(result.error);
      }
    } catch (error) {
      setErrorMessage(error.message || `Failed to sign in with ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: theme.colors.background }}>
      <div className="w-full max-w-md">
        {/* Auth Card */}
        <div 
          className="p-8 rounded-xl shadow-sm border" 
          style={{
            backgroundColor: theme.colors.authBg,
            borderColor: theme.colors.authBorder
          }}
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2" style={{ color: theme.colors.text }}>EduHelpify</h1>
            <p className="text-lg" style={{ color: theme.colors.text }}>The Ultimate Educational Assistant</p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div 
              className="mb-6 p-3 flex items-start rounded-lg text-sm"
              style={{
                backgroundColor: `${theme.colors.error}20`,
                color: theme.colors.error
              }}
            >
              <svg 
                className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 hover:bg-opacity-90 cursor-pointer "
            style={{
              backgroundColor: theme.colors.authButton,
              color: theme.colors.authButtonText,
              border: `1px solid ${theme.colors.authBorder}`
            }}
          >
            <FontAwesomeIcon icon={faGoogle} className="text-lg" />
            <span className="font-medium">
              {isLoading ? "Signing in..." : "Continue with Google"}
            </span>
          </button>

          {/* Footer Note */}
          <p className="mt-6 text-center text-sm" style={{ color: theme.colors.placeholder }}>
            By continuing, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}