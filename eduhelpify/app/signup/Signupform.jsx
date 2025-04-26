'use client';

import { useState } from 'react';
import { FormInput } from '../loginsignupcomponents/FormInput';
import { Authbutton } from '../loginsignupcomponents/Authbutton'; 
import { AuthFormContainer } from '../loginsignupcomponents/Maincontainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  faUser,
  faEnvelope, 
  faLock,
  faCircleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebookF, faApple } from '@fortawesome/free-brands-svg-icons';
import { signIn } from "next-auth/react";

export const Signupform = () => { 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
  
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields');
      return;
    }
  
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
  
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
  
    if (!termsAccepted) {
      setErrorMessage('Please accept the terms and conditions');
      return;
    }
  
    setIsLoading(true);
  console.log(email,name,password)
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          email, 
          password 
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }
  
 
      console.log('Signup successful', data);

      window.location.href = '/login';
      
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };
  const handleSocialsignup = async (provider) => {
    try {
      await signIn(provider, { callbackUrl: '/' });
    } catch (error) {
      setErrorMessage(`Failed to sign up with ${provider}`);
    }
  };
  
  return (
    <AuthFormContainer
      title="Create Account"
      subtitle="Please fill in your information"
      footerText="Already have an account?"
      footerLinkText="Sign In"
      footerLinkHref="/login"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <FormInput
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          label="Full Name"
          icon={<FontAwesomeIcon icon={faUser} />}
          hasError={!!errorMessage && !name}
        />

        {/* Email Input */}
        <FormInput
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email Address"
          icon={<FontAwesomeIcon icon={faEnvelope} />}
          hasError={!!errorMessage && !email}
        />

        {/* Password Input */}
        <FormInput
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
          icon={<FontAwesomeIcon icon={faLock} />}
          hasError={!!errorMessage && !password}
          showPasswordToggle={true}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        {/* Confirm Password Input */}
        <FormInput
          type={showConfirmPassword ? "text" : "password"}
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          label="Confirm Password"
          icon={<FontAwesomeIcon icon={faLock} />}
          hasError={!!errorMessage && !confirmPassword}
          showPasswordToggle={true}
          onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        {/* Terms Checkbox */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="h-4 w-4 rounded cursor-pointer focus:ring-2"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--primary)',
                backgroundColor: termsAccepted ? 'var(--primary)' : 'var(--cardBg)',
                '--tw-ring-color': 'var(--primary)'
              }}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="cursor-pointer text-text">
              I agree to the{' '}
              <a href="#" className="font-medium hover:underline text-primary">
                Terms
              </a>{' '}
              and{' '}
              <a href="#" className="font-medium hover:underline text-primary">
                Privacy Policy
              </a>
            </label>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="flex items-start text-sm p-3 rounded-md bg-error/20 text-error">
            <FontAwesomeIcon icon={faCircleExclamation} className="mt-0.5 mr-2" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <Authbutton
          isLoading={isLoading}
          text="Create Account"
          type="submit"
          disabled={isLoading}
        />

        {/* Social Login Section */}
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
  { icon: faFacebookF, color: '#4267B2', provider: 'facebook' },
  { icon: faApple, color: 'var(--text)', provider: 'apple' }
].map((social, i) => (
<button
  key={i}
  type="button"
  onClick={() =>  handleSocialsignup(social.provider)}
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