import './globals.css';
import { ThemeProvider } from '../contexts/ThemeContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en" >
<body className="transition-colors duration-300" >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}