"use client";
import { useTheme } from '../../../contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Spinner } from '../_components/spinner';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '../../../contexts/AuthContext';


const Settings = () => {
  const { user, signOut } = useAuth();

  const { theme, isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bio: '',
    profileImage: ''
  });
  
  // New state for task configuration
  const [taskConfig, setTaskConfig] = useState({
    content_length: 'medium',
    focus_area: '',
    difficulty_level: 'intermediate',
  });
  
  // State for focus area selection
  const [selectedFocusArea, setSelectedFocusArea] = useState('');
  const [customFocusArea, setCustomFocusArea] = useState('');
  


  useEffect(() => {
    const fetchTaskConfig = async () => {
      try {
        // In a real app, get the user ID from auth
        const response = await fetch(`/api/task/config?user_id=${user.id}`);
        const data = await response.json();
        
        if (response.ok && data.success && data.taskConfig) {
          setTaskConfig(data.taskConfig);
          
          // Set focus area and custom focus area
          if (data.taskConfig.focus_area) {
            if (['table', 'diagram', 'heading'].includes(data.taskConfig.focus_area)) {
              setSelectedFocusArea(data.taskConfig.focus_area);
            } else {
              setSelectedFocusArea('custom');
              setCustomFocusArea(data.taskConfig.focus_area);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch task config:', error);
      }
    };
    
    fetchTaskConfig();
  }, []);


 
  const handleTaskConfigChange = (e) => {
    const { name, value } = e.target;
    setTaskConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFocusAreaChange = (e) => {
    const value = e.target.value;
    setSelectedFocusArea(value);
    
    if (value !== 'custom') {
      setTaskConfig(prev => ({
        ...prev,
        focus_area: value
      }));
    } else {
      setTaskConfig(prev => ({
        ...prev,
        focus_area: customFocusArea
      }));
    }
  };
  
  const handleCustomFocusAreaChange = (e) => {
    const value = e.target.value;
    setCustomFocusArea(value);
    if (selectedFocusArea === 'custom') {
      setTaskConfig(prev => ({
        ...prev,
        focus_area: value
      }));
    }
  };

  

 
  
 // Update the handleTaskConfigSubmit function in the settings page
const handleTaskConfigSubmit = async (e) => {
  e.preventDefault();
  try {
    setIsLoading(true);
    
    // Make API call to save task configuration
    const response = await fetch('/api/task/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskConfig)
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      toast.success('Task configuration saved successfully');
    } else {
      throw new Error(data.error || 'Failed to save task configuration');
    }
    
  } catch (error) {
    toast.error(error.message || 'Failed to save task configuration');
  } finally {
    setIsLoading(false);
  }
};

// Add useEffect to fetch existing task config
useEffect(() => {
  const fetchTaskConfig = async () => {
    try {
      // In a real app, get the user ID from auth
      const userId = user.id;
      const response = await fetch(`/api/task/config?user_id=${userId}`);
      const data = await response.json();
      
      if (response.ok && data.success && data.taskConfig) {
        setTaskConfig(data.taskConfig);
        
        // Set focus area and custom focus area
        if (data.taskConfig.focus_area) {
          if (['table', 'diagram', 'heading'].includes(data.taskConfig.focus_area)) {
            setSelectedFocusArea(data.taskConfig.focus_area);
          } else {
            setSelectedFocusArea('custom');
            setCustomFocusArea(data.taskConfig.focus_area);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch task config:', error);
    }
  };
  
  fetchTaskConfig();
}, []);

  return (
<div className={`flex-1 py-10 px-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
  <div className="max-w-3xl mx-auto w-full">
    <div className={`rounded-2xl shadow-xl p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} transition-all duration-300`}>
      <h2 className="text-xl md:text-2xl font-extrabold mb-4 text-center tracking-wide" style={{ color: theme.colors.text }}>
      SETTINGS
</h2>



      <p className="text-center mb-6 text-sm" style={{ color: theme.colors.icon }}>
      Update your task configuration preferences
      </p>
      {/* Task Configuration */}
      <form onSubmit={handleTaskConfigSubmit} className="space-y-6">
        {/* Content Length */}
        <div>
          <label className="block mb-2 font-medium" style={{ color: theme.colors.primary }}>
            Content Length
          </label>
          <select
            name="content_length"
            className={`w-full px-4 py-3 border text-sm rounded-xl outline-none focus:ring-2 transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 focus:ring-blue-500' : 'bg-white border-gray-300 focus:ring-blue-200'}`}
            style={{ color: theme.colors.inputText }}
            value={taskConfig.content_length}
            onChange={handleTaskConfigChange}
            disabled={isLoading}
          >
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="detailed">Detailed</option>
          </select>
          <p className="text-xs mt-1 text-gray-500">Select how detailed you want the content to be</p>
        </div>

        {/* Focus Area */}
        <div>
          <label className="block mb-2 font-medium" style={{ color: theme.colors.primary }}>
            Focus Area
          </label>
          <select
            name="focus_area_type"
            className={`w-full px-4 py-3 border text-sm rounded-xl outline-none focus:ring-2 transition-all mb-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 focus:ring-blue-500' : 'bg-white border-gray-300 focus:ring-blue-200'}`}
            style={{ color: theme.colors.inputText }}
            value={selectedFocusArea}
            onChange={handleFocusAreaChange}
            disabled={isLoading}
          >
            <option value="">Select a focus area</option>
            <option value="table">Tables</option>
            <option value="diagram">Diagrams</option>
            <option value="heading">Headings</option>
            <option value="custom">Custom (specify below)</option>
          </select>

          {selectedFocusArea === 'custom' && (
            <input
              type="text"
              name="custom_focus_area"
              placeholder="Enter custom focus area"
              className={`w-full px-4 py-3 border text-sm rounded-xl outline-none focus:ring-2 transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 focus:ring-blue-500' : 'bg-white border-gray-300 focus:ring-blue-200'}`}
              style={{ color: theme.colors.inputText }}
              value={customFocusArea}
              onChange={handleCustomFocusAreaChange}
              disabled={isLoading}
            />
          )}
          <p className="text-xs mt-1 text-gray-500">Choose what elements to focus on in your content</p>
        </div>

        {/* Difficulty Level */}
        <div>
          <label className="block mb-2 font-medium" style={{ color: theme.colors.primary }}>
            Difficulty Level
          </label>
          <select
            name="difficulty_level"
            className={`w-full px-4 py-3 border text-sm rounded-xl outline-none focus:ring-2 transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 focus:ring-blue-500' : 'bg-white border-gray-300 focus:ring-blue-200'}`}
            style={{ color: theme.colors.inputText }}
            value={taskConfig.difficulty_level}
            onChange={handleTaskConfigChange}
            disabled={isLoading}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
          <p className="text-xs mt-1 text-gray-500">Select the complexity level for generated content</p>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-3 rounded-xl text-white font-semibold flex items-center justify-center shadow-md transition-all ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'hover:shadow-xl'}`}
            style={{ backgroundColor: isLoading ? theme.colors.primary : theme.colors.primary }}
          >
            {isLoading ? <Spinner /> : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

  );
};

export default Settings;