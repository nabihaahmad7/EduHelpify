// components/auth/LoginForm.jsx
'use client';

import { useState } from 'react';
import { FormInput } from '../loginsignupcomponents/FormInput';
import { Authbutton } from '../loginsignupcomponents/Authbutton';
import { AuthFormContainer } from '../loginsignupcomponents/Maincontainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTheme } from '@/contexts/ThemeContext';
import { signIn } from 'next-auth/react';  

import { 
  faEnvelope, 
  faLock,
  faCircleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebookF, faApple } from '@fortawesome/free-brands-svg-icons';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Validation checks
    if (!email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }


    setIsLoading(true);
    console.log(email,password)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }


      console.log('Login successful', data);
    
      
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };
  const handleSocialLogin = async (provider) => {
    try {
      const result = await signIn(provider, { callbackUrl: '/' });

      if (result?.error) {
        setErrorMessage(`Failed to sign in with ${provider}`);
      } else {
        console.log(`Successfully signed in with ${provider}`);
        window.location.href = '/dashboard'; // Redirect to a protected route
      }
    } catch (error) {
      setErrorMessage(`Failed to sign in with ${provider}`);
    }
  };
  return (
    <AuthFormContainer
      title="Welcome Back"
      subtitle="Sign in to continue to your account"
      footerText="Don't have an account?"
      footerLinkText="Sign Up"
      footerLinkHref="/signup"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form inputs and button */}
        <FormInput
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email Address"
          icon={<FontAwesomeIcon icon={faEnvelope} />}
          hasError={!!errorMessage && !email}
          errorMessage={errorMessage}
        />

        <FormInput
          type={showPassword ? "text" : "password"}
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
          icon={<FontAwesomeIcon icon={faLock} />}
          hasError={!!errorMessage && !password}
          showPasswordToggle={true}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        {errorMessage && (
          <div className="flex items-start text-sm p-3 rounded-md bg-error/20 text-error">
            <FontAwesomeIcon icon={faCircleExclamation} className="mt-0.5 mr-2" />
            <span>{errorMessage}</span>
          </div>
        )}

        <Authbutton
          isLoading={isLoading}
          text="Sign In"
          type="submit"
          disabled={isLoading}
        />

        {/* Social login section */}
        <div className="mt-8">
          <div className="relative flex items-center justify-center my-6">
            <div 
              className="absolute w-full" 
              style={{ borderTop: `1px solid ${theme.colors.inputBorder}` }}
            />
            <span 
              className="relative z-10 px-4 text-sm"
              style={{ 
                backgroundColor: theme.colors.cardBg,
                color: theme.colors.placeholder
              }}
            >
              Or continue with
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
  { icon: faGoogle, color: '#DB4437', provider: 'google' },
  { icon: faFacebookF, color: '#4267B2', provider: 'facebook' }, // optional
  { icon: faApple, color: 'currentColor', provider: 'apple' }    // optional
].map((social, i) => (
  <button
    key={i}
    type="button"
    onClick={() => handleSocialLogin(social.provider)}
    className="flex items-center justify-center py-2 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
    style={{
      borderColor: 'var(--border)',
      backgroundColor: 'var(--cardBg)',
      color: social.color
    }}
  >
    <FontAwesomeIcon icon={social.icon} />
  </button>
            ))}
          </div>
        </div>
      </form>
    </AuthFormContainer>
  );
};