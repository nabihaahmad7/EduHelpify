"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Headerd() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
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
          <Link href="#features" className="text-[#6c6c6c] hover:text-[#01427a] transition-colors duration-300 text-sm lg:text-base">Features</Link>
          <Link href="#how-it-works" className="text-[#6c6c6c] hover:text-[#01427a] transition-colors duration-300 text-sm lg:text-base">How It Works</Link>
          <Link href="#for-teachers" className="text-[#6c6c6c] hover:text-[#01427a] transition-colors duration-300 text-sm lg:text-base">For Teachers</Link>
          <Link href="#for-students" className="text-[#6c6c6c] hover:text-[#01427a] transition-colors duration-300 text-sm lg:text-base">For Students</Link>
        </nav>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button className="border border-[#01427a] text-[#01427a] px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-[#01427a] hover:text-white transition-colors duration-300 whitespace-nowrap text-sm sm:text-base">
            Sign In
          </button>
          <button className="bg-[#01b3ef] text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-[#6dcffb] transition-colors duration-300 whitespace-nowrap text-sm sm:text-base">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}