'use client'
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope,
  faPhoneAlt
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn
} from '@fortawesome/free-brands-svg-icons';
import { useTheme } from '../../../contexts/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer 
      className="pt-12 pb-6 text-white"
      style={{ backgroundColor: theme.colors.footerBg }}
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <div className="text-2xl font-bold mb-5">
              <img 
                src="/images/logo.png" 
                alt="EduHelpify" 
                className="h-12 w-auto" 
              />
            </div>
            <p className="mb-4 text-sm" style={{ color: theme.colors.footerText }}>
              Revolutionizing education with AI-powered tools.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <Link href="#" className="transition-colors duration-300" style={{ color: theme.colors.footerText }}>
                <FontAwesomeIcon icon={faFacebookF} />
              </Link>
              <Link href="#" className="transition-colors duration-300" style={{ color: theme.colors.footerText }}>
                <FontAwesomeIcon icon={faTwitter} />
              </Link>
              <Link href="#" className="transition-colors duration-300" style={{ color: theme.colors.footerText }}>
                <FontAwesomeIcon icon={faInstagram} />
              </Link>
              <Link href="#" className="transition-colors duration-300" style={{ color: theme.colors.footerText }}>
                <FontAwesomeIcon icon={faLinkedinIn} />
              </Link>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <div className="mb-2" style={{ color: theme.colors.footerText }}>
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
        
        <div 
          className="border-t mt-8 pt-6"
          style={{ borderColor: theme.colors.border }}
        >
          <div className="flex justify-center"> 
            <p className="text-xs text-center" style={{ color: theme.colors.footerText }}> 
              © 2025 EduHelpify. All rights reserved by NextGenCoders.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}