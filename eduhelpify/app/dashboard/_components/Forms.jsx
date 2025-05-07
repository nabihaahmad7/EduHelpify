"use client";
import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faFile } from '@fortawesome/free-solid-svg-icons';

export default function Form() {
  const { theme, isDarkMode } = useTheme();
  const { user } = useAuth();

  const [email, setEmail] = useState(user?.email || "");
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [contentTypes, setContentTypes] = useState([]);
  const [selectedOutputType, setSelectedOutputType] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [taskConfig, setTaskConfig] = useState(null);

  const MAX_FILE_SIZE = 30* 1024 * 1024; // 10MB
  // Check form validity whenever inputs change
  useEffect(() => {
    const isValid = email && 
                   prompt && 
                   file && 
                   selectedOutputType && 
                   (file.size <= MAX_FILE_SIZE);
    setFormValid(isValid);
  }, [email, prompt, file, selectedOutputType]);

  // Fetch content types
  useEffect(() => {
    const fetchContentTypes = async () => {
      try {
        const response = await fetch("/api/contentTypes");
        const data = await response.json();
        if (data.success && data.contentTypes) {
          setContentTypes(data.contentTypes);
        }
      } catch (error) {
        console.error("Failed to fetch content types:", error);
        toast.error("Failed to load output formats");
      }
    };

    fetchContentTypes();
  }, []);

  useEffect(() => {
    const fetchTaskConfig = async () => {
      try {
        // Use actual user ID from auth context if available
        const userId = user?.id ;
        console.log(userId,"ye meri id")
        const response = await fetch(`/api/task/config?user_id=${userId}`);
        const data = await response.json();
        
        if (data.success && data.taskConfig) {
          setTaskConfig(data.taskConfig);
        }
      } catch (error) {
        console.error("Failed to fetch task config:", error);
      }
    };

    fetchTaskConfig();
  }, [user]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error("File size should be less than 10MB");
        return;
      }

      const validTypes = ['text/plain', 'application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 
        'audio/mpeg', 'audio/wav', 'audio/mp3'];
const validExtensions = ['.txt', '.pdf', '.jpeg', '.jpg', '.png', 
             '.mp3', '.wav'];
const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();

if (!validTypes.includes(selectedFile.type) && !validExtensions.includes(fileExtension)) {
toast.error("Please upload a supported file format (.txt, .pdf, .jpg, .jpeg, .png, .mp3)");
return;
}
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Email is required!");
      return;
    }
    if (!file) {
      toast.error("File upload is required!");
      return;
    }
    if (!prompt) {
      toast.error("Instructions are required!");
      return;
    }
    if (!selectedOutputType) {
      toast.error("Output format is required!");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Processing your request...");

    try {
      const formData = new FormData();
      const userId = user?.id || "current-user-id";
      formData.append("user_id", userId);
      formData.append("task_config_id", taskConfig.id);
      formData.append("input_content_type_id", "c0a80101-0000-0000-0000-000000000021");
      formData.append("output_content_type_id", selectedOutputType);
      formData.append("user_prompt", prompt);
      formData.append("files", file);

      const response = await fetch("/api/task", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Submission failed");
      }

      toast.dismiss(toastId);
      toast.success(
        <div>
          <p>Success! Your document is being processed.</p>
          <p className="text-sm">You will receive the output at <strong>{email}</strong></p>
        </div>,
        { duration: 5000 }
      );

      // Reset form
      setPrompt("");
      setFile(null);
      setFileName("");
      setSelectedOutputType("");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.message || "Failed to submit. Please try again.");
      console.error("Submission failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
<div className={`flex flex-col min-h-screen py-10 px-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
  <div className="max-w-3xl mx-auto w-full">
    <div className={`rounded-2xl shadow-xl p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} transition-all duration-300`}>
      
    <h2 className="text-xl md:text-2xl font-extrabold mb-4 text-center tracking-wide" style={{ color: theme.colors.text }}>
  DASHBOARD
</h2>



      <p className="text-center mb-6 text-sm" style={{ color: theme.colors.icon }}>
        Fill all the fields to create your task
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Email Input */}
        <div>
          <label className="block mb-2 font-medium" style={{ color: theme.colors.primary  }}>
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            className={`w-full px-4 py-3 border text-sm rounded-xl outline-none focus:ring-2 transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 focus:ring-blue-500' : 'bg-white border-gray-300 focus:ring-blue-200'} ${!email ? 'border-red-500' : ''}`}
            style={{ color: theme.colors.inputText }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block mb-2 font-medium" style={{ color: theme.colors.primary  }}>
            Upload Document (PDF/TXT, max 10MB) <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <label className={`flex-1 flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-xl cursor-pointer hover:border-blue-500 text-center transition-all ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-100'} ${!file ? 'border-red-500' : ''}`}>
              <FontAwesomeIcon icon={faFile} className="text-3xl" style={{ color: theme.colors.icon }} />
              <p className="text-sm" style={{ color: theme.colors.icon }}>
                {fileName || "Click to browse or drag & drop"}
              </p>
              <p className="text-xs mt-1" style={{ color: theme.colors.icon }}>
                Supported formats: PDF, TXT, JPEG, JPG, PNG, MP3, WAV (Max 30MB)
              </p>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".txt,.pdf,.jpeg,.jpg,.png,.mp3,.wav"
                required
              />
            </label>

            {fileName && (
              <button
                type="button"
                className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white text-sm transition-all`}
                onClick={() => {
                  setFile(null);
                  setFileName("");
                }}
              >
                Remove File
              </button>
            )}
          </div>
        </div>

        {/* Prompt Input */}
        <div>
          <label className="block mb-2 font-medium" style={{ color: theme.colors.primary  }}>
            Your Instructions <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Enter detailed instructions for document processing..."
            className={`w-full p-4 border text-sm rounded-xl outline-none resize-none focus:ring-2 transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 focus:ring-blue-500' : 'bg-white border-gray-300 focus:ring-blue-200'} ${!prompt ? 'border-red-500' : ''}`}
            style={{ color: theme.colors.inputText, minHeight: '120px' }}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Output Format */}
        <div>
          <label className="block mb-2 font-medium" style={{ color: theme.colors.primary  }}>
            Output Format <span className="text-red-500">*</span>
          </label>
          <select
            className={`w-full p-3 border text-sm rounded-xl outline-none focus:ring-2 transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 focus:ring-blue-500' : 'bg-white border-gray-300 focus:ring-blue-200'} ${!selectedOutputType ? 'border-red-500' : ''}`}
            style={{ color: theme.colors.text }}
            value={selectedOutputType}
            onChange={(e) => setSelectedOutputType(e.target.value)}
            required
          >
            <option value="">Select output format</option>
            {contentTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!formValid || loading}
            className={`w-full py-3 px-4 rounded-xl text-white font-semibold flex items-center justify-center shadow-md transition-all ${(!formValid || loading) ? 'bg-gray-400 cursor-not-allowed' : 'hover:shadow-xl'}`}
            style={{
              backgroundColor: formValid ? theme.colors.primary : '#ccc'
            }}
          >
            <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
            {loading ? "Processing..." : "Submit Document"}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

  );
}