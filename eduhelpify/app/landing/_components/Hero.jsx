'use client'
import Image from 'next/image';
import { useTheme } from '@/contexts/ThemeContext';

export default function Hero() {
  const { theme, isDarkMode } = useTheme();

  return (
    <section 
      className="pt-24 relative overflow-hidden min-h-[700px]" 
      style={{
        backgroundImage: "url('/images/herobg1.jpg')", 
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: isDarkMode ? 'rgb(36,33,36,1)' : 'transparent',
        backgroundBlendMode: 'multiply'
      }}
    >
      <div className="container mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row items-center">
          <div 
            className="md:w-1/2 mb-10 md:mb-0 p-10 rounded-xl"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(2px)'
            }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: isDarkMode ? theme.colors.text : '#0c0c0d' }}>
              AI-Powered Assistant for <span style={{ color: theme.colors.primary }}>Teachers</span> and <span style={{ color: theme.colors.secondary }}>Students</span>
            </h1>
            <p className="text-xl mb-8" style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)' }}>
              Revolutionize education with our intelligent platform that helps teachers create engaging content and enables students to learn more effectively.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                className="px-9 py-3 rounded-lg transition-colors duration-300 whitespace-nowrap hover:opacity-90"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.buttonText
                }}
              >
                <i className="fas fa-chalkboard-teacher mr-2"></i>Try for Free
              </button>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <Image 
              src="/images/herobg2.jpg"
              alt="AI Education Assistant"
              width={600}
              height={600}
              className="rounded-xl shadow-2xl max-w-full h-auto"
              style={{
                filter: isDarkMode ? 'brightness(0.8)' : 'none'
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path 
            fill={isDarkMode ? theme.colors.background : '#ffffff'} 
            fillOpacity="1" 
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
}