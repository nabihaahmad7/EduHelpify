"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '../../../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { useRouter } from 'next/navigation';

export default function Headerd() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, isDarkMode } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerStyle = {
    backgroundColor: scrolled ? theme.colors.background : 'transparent',
    borderBottom: scrolled ? `1px solid ${theme.colors.border}` : 'none'
  };

  const navLinkStyle = {
    color: scrolled ? theme.colors.text : isDarkMode ? '#e2e8f0' : '#6c6c6c',
    hoverColor: theme.colors.primary
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-md py-2' : 'py-4'}`}
      style={headerStyle}
    >
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <img 
              src="/images/logo.png" 
              alt="EduHelpify" 
              className={`transition-all duration-300 ${scrolled ? 'h-10 w-auto' : 'h-12 w-auto'}`} 
            />
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-10">
          <Link 
            href="#features" 
            className="transition-colors duration-300 text-sm lg:text-base"
            style={{ 
              color: navLinkStyle.color,
              '&:hover': { color: navLinkStyle.hoverColor }
            }}
          >
            Features
          </Link>
          <Link 
            href="#how-it-works" 
            className="transition-colors duration-300 text-sm lg:text-base"
            style={{ 
              color: navLinkStyle.color,
              '&:hover': { color: navLinkStyle.hoverColor }
            }}
          >
            How It Works
          </Link>
          <Link 
            href="#for-teachers" 
            className="transition-colors duration-300 text-sm lg:text-base"
            style={{ 
              color: navLinkStyle.color,
              '&:hover': { color: navLinkStyle.hoverColor }
            }}
          >
            For Teachers
          </Link>
          <Link 
            href="#for-students" 
            className="transition-colors duration-300 text-sm lg:text-base"
            style={{ 
              color: navLinkStyle.color,
              '&:hover': { color: navLinkStyle.hoverColor }
            }}
          >
            For Students
          </Link>
        </nav>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <ThemeToggle />
          <button 
            className="border px-3 py-1 sm:px-4 sm:py-2 rounded-lg whitespace-nowrap text-sm sm:text-base transition-colors duration-300 cursor-pointer"
            style={{
              borderColor: theme.colors.primary,
              color: theme.colors.primary,
              '&:hover': {
                backgroundColor: theme.colors.primary,
                color: theme.colors.buttonText
              }
            }}
            onClick={() => router.push('/auth')}
          >
            Sign In
          </button>
          <button 
            className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg whitespace-nowrap text-sm sm:text-base transition-colors duration-300"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.buttonText,
              '&:hover': {
                backgroundColor: isDarkMode ? theme.colors.secondary : '#6dcffb'
              }
            }}
            onClick={() => router.push('/auth')}  
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}