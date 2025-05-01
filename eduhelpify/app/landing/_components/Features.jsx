'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLaptopCode, faQuestionCircle, faBookOpen, faMicrophoneAlt } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../../contexts/ThemeContext';

export default function Features() {
  const { theme, isDarkMode } = useTheme();

  const features = [
    {
      icon: faLaptopCode,
      title: 'Case Study Generator',
      description: 'Generate case studies instantly with AI - get professional analysis, findings, and recommendations.'
    },
    {
      icon: faQuestionCircle,
      title: 'Smart Quiz Creator',
      description: 'Generate quizzes and assessments automatically with customizable difficulty levels and question types.'
    },
    {
      icon: faBookOpen,
      title: 'Auto Note Generation',
      description: 'Convert lectures into comprehensive, organized notes with key points highlighted and summarized.'
    },
    {
      icon: faMicrophoneAlt,
      title: 'Lecture Transcription',
      description: 'Automatically transcribe audio and video lectures with high accuracy and searchable text output.'
    }
  ];

  return (
    <section id="features" className="py-20" style={{ backgroundColor: theme.colors.background }}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: theme.colors.text }}>
            Powerful Features
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: theme.colors.text }}>
            Our platform offers specialized tools for both teachers and students to enhance the educational experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="rounded-xl shadow-lg p-8 transform transition-transform duration-300 hover:scale-105"
              style={{ 
                backgroundColor: theme.colors.cardBg,
                border: `1px solid ${theme.colors.border}`
              }}
            >
              <div 
                className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-r" 
                style={{ 
                  backgroundImage: `linear-gradient(to right, ${theme.colors.gradientFrom}, ${theme.colors.gradientTo})`
                }}
              >
                <FontAwesomeIcon 
                  icon={feature.icon} 
                  className="text-white text-3xl" 
                />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center" style={{ color: theme.colors.text }}>
                {feature.title}
              </h3>
              <p className="text-center" style={{ color: theme.colors.text }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}