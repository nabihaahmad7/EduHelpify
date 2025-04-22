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

export default function UserComparison() {
  const [activeTab, setActiveTab] = useState('teacher');

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
      description: 'AI-powered tool to generate notes generatory'
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
    <section id="for-teachers" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Choose Your Experience</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform is tailored to meet the specific needs of both teachers and students.
          </p>
          <div className="mt-8 inline-flex items-center bg-gray-100 p-1 rounded-full">
            <button 
              onClick={() => setActiveTab('teacher')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${activeTab === 'teacher' ? 'bg-[#01427a] text-white' : 'text-[#6c6c6c]'} whitespace-nowrap`}
            >
              For Teachers
            </button>
            <button 
              onClick={() => setActiveTab('student')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${activeTab === 'student' ? 'bg-[#01b3ef] text-white' : 'text-[#6c6c6c]'} whitespace-nowrap`}
            >
              For Students
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <Image 
              src={activeTab === 'teacher' ? 
                "/images/usercomparison1.jpg" : 
                "/images/usercomparison2.jpg"}
              alt={activeTab === 'teacher' ? "Teacher using EduAI" : "Student using EduAI"}
              width={600}
              height={400}
              className="w-full h-64 object-cover object-top rounded-lg mb-8"
            />
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {activeTab === 'teacher' ? 'Empower Your Teaching' : 'Enhance Your Learning'}
            </h3>
            <ul className="space-y-4">
              {activeTab === 'teacher' ? (
                <>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#01427a] mt-1 mr-3" />
                    <span>Create engaging presentations in minutes</span>
                  </li>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#01427a] mt-1 mr-3" />
                    <span>Generate quizzes with varying difficulty levels</span>
                  </li>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#01427a] mt-1 mr-3" />
                    <span>Design interactive assignments and case studies</span>
                  </li>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#01427a] mt-1 mr-3" />
                    <span>Access a library of educational resources</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#01b3ef] mt-1 mr-3" />
                    <span>Generate comprehensive notes from lectures</span>
                  </li>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#01b3ef] mt-1 mr-3" />
                    <span>Transcribe audio and video lectures automatically</span>
                  </li>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#01b3ef] mt-1 mr-3" />
                    <span>Create study guides and flashcards</span>
                  </li>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#01b3ef] mt-1 mr-3" />
                    <span>Get personalized learning recommendations</span>
                  </li>
                </>
              )}
            </ul>
            <div className="mt-8">
              <button className={`w-full py-3 rounded-lg text-white transition-colors duration-300 ${activeTab === 'teacher' ? 'bg-[#01427a] hover:bg-[#01b3ef]' : 'bg-[#01b3ef] hover:bg-[#6dcffb]'} whitespace-nowrap`}>
                Get Started Free
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {activeTab === 'teacher' ? 'Teacher Features' : 'Student Features'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(activeTab === 'teacher' ? teacherFeatures : studentFeatures).map((feature, index) => (
                <div key={index} className={`${activeTab === 'teacher' ? 'bg-blue-50' : 'bg-green-50'} p-4 rounded-lg`}>
                  <div className="flex items-center mb-3">
                    <FontAwesomeIcon 
                      icon={feature.icon} 
                      className={`${activeTab === 'teacher' ? 'text-[#2B6CB0]' : 'text-[#38A169]'} mr-3`} 
                    />
                    <h4 className="font-semibold">{feature.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}