"use client";
import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Settings = () => {
  const { theme, isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bio: '',
    profileImage: ''
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/user');
        const data = await response.json();
        
        if (response.ok) {
          setFormData({
            fullName: data.fullName || '',
            email: data.email || '',
            phone: data.phone || 'Please Entre Your Phone Number',
            bio: data.bio || 'Please Entre Your Bio',
            profileImage: data.profileImage || ''
          });
        } else {
          throw new Error(data.message || 'Failed to fetch user data');
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await fetch('/api/user/upload-image', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setFormData(prev => ({
          ...prev,
          profileImage: data.imageUrl
        }));
        toast.success('Profile image updated successfully');
      } else {
        throw new Error(data.message || 'Failed to upload image');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Profile updated successfully');
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex-1 p-6 overflow-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 
          className="text-2xl font-bold mb-6" 
          style={{ color: theme.colors.text }}
        >
          Settings
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            <div className="flex items-start gap-8">
              <div className="flex flex-col items-center">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden mb-2"
                  style={{ backgroundColor: theme.colors.iconBg + '10' }}
                >
                  {formData.profileImage ? (
                    <img 
                      src={formData.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                </div>
                <label className="text-sm hover:underline cursor-pointer" style={{ color: theme.colors.secondary }}>
                  Change Photo
                  <input 
                    type="file" 
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isLoading}
                  />
                </label>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <label 
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.colors.primary }}
                  >
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    name="fullName"
                    className="w-full p-2 border rounded focus:outline-none text-sm"
                    style={{
                      borderColor: theme.colors.inputBorder,
                      color: theme.colors.inputText,
                      backgroundColor: isDarkMode ? theme.colors.cardBg : 'white',
                      focusBorderColor: theme.colors.focusBorder
                    }}
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label 
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.colors.primary }}
                  >
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    className="w-full p-2 border rounded focus:outline-none text-sm"
                    style={{
                      borderColor: theme.colors.inputBorder,
                      color: theme.colors.inputText,
                      backgroundColor: isDarkMode ? theme.colors.cardBg : 'white',
                      focusBorderColor: theme.colors.focusBorder
                    }}
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label 
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.colors.primary }}
                  >
                    Phone Number
                  </label>
                  <input 
                    type="tel" 
                    name="phone"
                    className="w-full p-2 border rounded focus:outline-none text-sm"
                    style={{
                      borderColor: theme.colors.inputBorder,
                      color: theme.colors.inputText,
                      backgroundColor: isDarkMode ? theme.colors.cardBg : 'white',
                      focusBorderColor: theme.colors.focusBorder
                    }}
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label 
                className="block text-sm font-medium mb-1"
                style={{ color: theme.colors.primary }}
              >
                Bio
              </label>
              <textarea 
                name="bio"
                className="w-full p-2 border rounded focus:outline-none text-sm h-24"
                style={{
                  borderColor: theme.colors.inputBorder,
                  color: theme.colors.inputText,
                  backgroundColor: isDarkMode ? theme.colors.cardBg : 'white',
                  focusBorderColor: theme.colors.focusBorder
                }}
                value={formData.bio}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            
            <div className="flex justify-end">
              <button 
                type="submit"
                className="text-white px-4 py-2 rounded hover:bg-opacity-90 transition disabled:opacity-50"
                style={{ backgroundColor: theme.colors.error }}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;