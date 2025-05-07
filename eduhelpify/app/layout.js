import './globals.css';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import { Toaster } from 'react-hot-toast';
export default function RootLayout({ children }) {
  return (
    <html lang="en" >
<body className="transition-colors duration-300" >
<Toaster position="top-right" reverseOrder={false} />
        <ThemeProvider>
          <AuthProvider>
            <ProtectedRoute>
              {children}
            </ProtectedRoute>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}