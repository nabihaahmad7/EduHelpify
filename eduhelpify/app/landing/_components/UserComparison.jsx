'use client'
import { useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDesktop,
  faTasks,
  faProjectDiagram,
  faClipboard,
  faCalendarAlt,
  faFileAlt,
  faHeadphones,
  faBrain,
  faSearch,
  faComments,
  faLightbulb,
  faCheckCircle,
  faNoteSticky
} from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../../contexts/ThemeContext';

export default function UserComparison() {
  const [activeTab, setActiveTab] = useState('teacher');
  const { theme, isDarkMode } = useTheme();

  const teacherFeatures = [
    {
      icon: faDesktop,
      title: 'Presentation Creator',
      description: 'AI-powered tool to generate professional slides'
    },
    {
      icon: faTasks,
      title: 'Quiz Generator',
      description: 'Create assessments with various question types'
    },
    {
      icon: faProjectDiagram,
      title: 'Assignment Builder',
      description: 'Design custom assignments and projects'
    },
    {
      icon: faNoteSticky,
      title: 'Case Study',
      description: 'AI-powered tool to generate case study'
    },
    {
      icon: faClipboard,
      title: 'Notes Generator',
      description: 'AI-powered tool to generate notes generator'
    },
    {
      icon: faCalendarAlt,
      title: 'Lesson Planner',
      description: 'Create and schedule lesson plans'
    }
  ];

  const studentFeatures = [
    {
      icon: faFileAlt,
      title: 'Note Generator',
      description: 'Convert lectures into organized notes'
    },
    {
      icon: faHeadphones,
      title: 'Audio Transcription',
      description: 'Transcribe lectures with high accuracy'
    },
    {
      icon: faBrain,
      title: 'Study Guide Creator',
      description: 'Generate personalized study materials'
    },
    {
      icon: faSearch,
      title: 'Content Search',
      description: 'Find specific topics in your notes'
    },
    {
      icon: faComments,
      title: 'Collaboration Tools',
      description: 'Work together with classmates'
    },
    {
      icon: faLightbulb,
      title: 'Learning Assistant',
      description: 'Get help with difficult concepts'
    }
  ];

  return (
    <section id="for-teachers" className="py-20" style={{ backgroundColor: theme.colors.background }}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: theme.colors.text }}>
            Choose Your Experience
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: theme.colors.text }}>
            Our platform is tailored to meet the specific needs of both teachers and students.
          </p>
          <div className="mt-8 inline-flex items-center p-1 rounded-full" style={{ backgroundColor: theme.colors.cardBg }}>
            <button 
              onClick={() => setActiveTab('teacher')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${activeTab === 'teacher' ? 'text-white' : ''} whitespace-nowrap`}
              style={{
                backgroundColor: activeTab === 'teacher' ? theme.colors.primary : 'transparent',
                color: activeTab === 'teacher' ? theme.colors.buttonText : theme.colors.text
              }}
            >
              For Teachers
            </button>
            <button 
              onClick={() => setActiveTab('student')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${activeTab === 'student' ? 'text-white' : ''} whitespace-nowrap`}
              style={{
                backgroundColor: activeTab === 'student' ? theme.colors.secondary : 'transparent',
                color: activeTab === 'student' ? theme.colors.buttonText : theme.colors.text
              }}
            >
              For Students
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="rounded-xl shadow-lg p-8" style={{ 
            backgroundColor: theme.colors.cardBg,
            border: `1px solid ${theme.colors.border}`
          }}>
            <Image 
              src={activeTab === 'teacher' ? 
                "/images/usercomparison1.jpg" : 
                "/images/usercomparison2.jpg"}
              alt={activeTab === 'teacher' ? "Teacher using EduAI" : "Student using EduAI"}
              width={600}
              height={400}
              className="w-full h-64 object-cover object-top rounded-lg mb-8"
            />
            <h3 className="text-2xl font-bold mb-6" style={{ color: theme.colors.text }}>
              {activeTab === 'teacher' ? 'Empower Your Teaching' : 'Enhance Your Learning'}
            </h3>
            <ul className="space-y-4">
              {(activeTab === 'teacher' ? [
                "Create engaging presentations in minutes",
                "Generate quizzes with varying difficulty levels",
                "Design interactive assignments and case studies",
                "Access a library of educational resources"
              ] : [
                "Generate comprehensive notes from lectures",
                "Transcribe audio and video lectures automatically",
                "Create study guides and flashcards",
                "Get personalized learning recommendations"
              ]).map((item, index) => (
                <li key={index} className="flex items-start">
                  <FontAwesomeIcon 
                    icon={faCheckCircle} 
                    className="mt-1 mr-3" 
                    style={{ color: activeTab === 'teacher' ? theme.colors.primary : theme.colors.secondary }} 
                  />
                  <span style={{ color: theme.colors.text }}>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <button 
                className="w-full py-3 rounded-lg text-white transition-colors duration-300 whitespace-nowrap"
                style={{
                  backgroundColor: activeTab === 'teacher' ? theme.colors.primary : theme.colors.secondary
                }}
              >
                Get Started Free
              </button>
            </div>
          </div>
          
          <div className="rounded-xl shadow-lg p-8" style={{ 
            backgroundColor: theme.colors.cardBg,
            border: `1px solid ${theme.colors.border}`
          }}>
            <h3 className="text-2xl font-bold mb-6" style={{ color: theme.colors.text }}>
              {activeTab === 'teacher' ? 'Teacher Features' : 'Student Features'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(activeTab === 'teacher' ? teacherFeatures : studentFeatures).map((feature, index) => (
                <div 
                  key={index} 
                  className="p-4 rounded-lg"
                  style={{ 
                    backgroundColor: isDarkMode ? theme.colors.background : 
                      (activeTab === 'teacher' ? 'rgba(0, 100, 200, 0.1)' : 'rgba(0, 200, 100, 0.1)'),
                    border: `1px solid ${theme.colors.border}`
                  }}
                >
                  <div className="flex items-center mb-3">
                    <FontAwesomeIcon 
                      icon={feature.icon} 
                      className="mr-3" 
                      style={{ color: activeTab === 'teacher' ? theme.colors.primary : theme.colors.secondary }} 
                    />
                    <h4 className="font-semibold" style={{ color: theme.colors.text }}>{feature.title}</h4>
                  </div>
                  <p className="text-sm" style={{ color: theme.colors.text }}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}