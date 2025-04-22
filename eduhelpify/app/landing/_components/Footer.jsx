import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGraduationCap,
  faPaperPlane,
  faEnvelope,
  faPhoneAlt
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn
} from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <div className="text-2xl font-bold mb-5">
            <img 
              src="/images/logo.png" 
              alt="EduHelpify" 
              className={'h-12 w-auto' } 
            />
            </div>
            <p className="text-gray-400 mb-4 text-sm">
              Revolutionizing education with AI-powered tools.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FontAwesomeIcon icon={faFacebookF} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FontAwesomeIcon icon={faTwitter} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FontAwesomeIcon icon={faInstagram} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </Link>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <div className="text-gray-400 mb-2">
              <p className="mb-1">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                contact@eduai.com
              </p>
              <p>
                <FontAwesomeIcon icon={faPhoneAlt} className="mr-2" />
                +1 (555) 123-4567
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6">
  <div className="flex justify-center"> 
    <p className="text-gray-400 text-xs text-center"> 
      © 2025 EduHelpify. All rights reserved by NextGenCoders.
    </p>
  </div>
</div>
      </div>
    </footer>
  );
}