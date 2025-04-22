'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faCog, faRocket } from '@fortawesome/free-solid-svg-icons'

export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      icon: faUserPlus,
      title: 'Create an Account',
      description: 'Sign up as a teacher or student and set up your profile with your  details.'
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
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started with our platform in just a few simple steps.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start space-y-12 md:space-y-0 md:space-x-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="md:w-1/3 bg-white p-8 rounded-xl shadow-lg relative z-10">
              <div className="w-12 h-12 rounded-full bg-[#2B6CB0] text-white flex items-center justify-center text-xl font-bold mb-6 mx-auto">
                {step.number}
              </div>
              <div className="text-center mb-6">
                <FontAwesomeIcon 
                  icon={step.icon} 
                  className="text-5xl text-[#2B6CB0]" 
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{step.title}</h3>
              <p className="text-gray-600 text-center">{step.description}</p>
            </div>
          ))}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#2B6CB0] to-[#38A169] transform -translate-y-1/2 z-0"></div>
        </div>
      </div>
    </section>
  );
}