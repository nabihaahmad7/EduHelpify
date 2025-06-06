'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faCog, faRocket } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../contexts/ThemeContext';

export default function HowItWorks() {
  const { theme, isDarkMode } = useTheme();

  const steps = [
    {
      number: '1',
      icon: faUserPlus,
      title: 'Create an Account',
      description: 'Sign up as a teacher or student and set up your profile with your details.'
    },
    {
      number: '2',
      icon: faCog,
      title: 'Choose Your Tools',
      description: 'Select the features you need based on your role and educational requirements.'
    },
    {
      number: '3',
      icon: faRocket,
      title: 'Start Creating',
      description: 'Begin generating casestudies, quizzes, notes, or transcriptions with our AI-powered tools.'
    }
  ];

  return (
    <section 
      id="how-it-works" 
      className="py-20"
      style={{
        background: isDarkMode 
          ? `rgba(18, 31, 34, 1)  `
          : `linear-gradient(135deg, ${theme.colors.heroBg} 0%, #f0fdf4 100%)`
      }}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: theme.colors.text }}>
            How It Works
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: theme.colors.text }}>
            Get started with our platform in just a few simple steps.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start space-y-12 md:space-y-0 md:space-x-8 relative">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="md:w-1/3 p-8 rounded-xl shadow-lg relative z-10"
              style={{
                backgroundColor: theme.colors.cardBg,
                border: `1px solid ${theme.colors.border}`
              }}
            >
              <div 
                className="w-12 h-12 rounded-full text-white flex items-center justify-center text-xl font-bold mb-6 mx-auto"
                style={{ backgroundColor: theme.colors.primary }}
              >
                {step.number}
              </div>
              <div className="text-center mb-6">
                <FontAwesomeIcon 
                  icon={step.icon} 
                  className="text-5xl"
                  style={{ color: theme.colors.primary }}
                />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center" style={{ color: theme.colors.text }}>
                {step.title}
              </h3>
              <p className="text-center" style={{ color: theme.colors.text }}>
                {step.description}
              </p>
            </div>
          ))}
          <div 
            className="hidden md:block absolute top-1/2 left-0 right-0 h-1 transform -translate-y-1/2 z-0"
            style={{
              background: `linear-gradient(to right, ${theme.colors.gradientFrom}, ${theme.colors.gradientTo})`
            }}
          ></div>
        </div>
      </div>
    </section>
  );
}