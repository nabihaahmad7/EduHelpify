'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLaptopCode, faQuestionCircle, faBookOpen, faMicrophoneAlt, faArrowRight } from '@fortawesome/free-solid-svg-icons'

export default function Features() {
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
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform offers specialized tools for both teachers and students to enhance the educational experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-8 transform transition-transform duration-300 hover:scale-105">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-r from-[#01427a] to-[#01b3ef]">
                <FontAwesomeIcon 
                  icon={feature.icon} 
                  className="text-white text-3xl" 
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{feature.title}</h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
              <div className="text-center mt-6">
                <a href="#" className="text-[#2B6CB0] hover:text-[#1E4E8C] font-medium cursor-pointer">
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}