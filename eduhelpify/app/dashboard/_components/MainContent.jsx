"use client";
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPlus, faComments } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../contexts/AuthContext';

export default function MainContent() {
  const { theme, isDarkMode } = useTheme();
  const { user } = useAuth();

  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState([]);         
  const [file, setFile] = useState(null);        
  const [error, setError] = useState(null);      
  const [messages, setMessages] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [contentTypes, setContentTypes] = useState([]);
  const [selectedOutputType, setSelectedOutputType] = useState(null);
  const [taskConfig, setTaskConfig] = useState(null);

  const chatAreaRef = useRef(null);

  // Fetch content types
  useEffect(() => {
    const fetchContentTypes = async () => {
      try {
        const response = await fetch("/api/contentTypes");
        const data = await response.json();
        if (data.success && data.contentTypes) {
          setContentTypes(data.contentTypes);
          
          // Default to PDF if available
          const pdfType = data.contentTypes.find(type => type.name === 'PDF');
          if (pdfType) {
            setSelectedOutputType(pdfType.id);
          } else if (data.contentTypes.length > 0) {
            setSelectedOutputType(data.contentTypes[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch content types:", error);
      }
    };

    fetchContentTypes();
  }, []);

  // Fetch task config from settings page
  useEffect(() => {
    const fetchTaskConfig = async () => {
      try {
        // Use actual user ID from auth context if available
        const userId = user?.id ;
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
      // Check file size (30MB limit)
      if (selectedFile.size > 30 * 1024 * 1024) {
        setError('File size exceeds 30MB limit');
        return;
      }
  
      if (
        selectedFile.type === 'text/plain' ||
        selectedFile.type === 'application/pdf' ||
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
        selectedFile.type === 'image/png' ||
        selectedFile.type === 'image/jpeg' ||
        selectedFile.type === 'image/jpg' ||
        selectedFile.type === 'audio/mpeg' ||
        selectedFile.type === 'audio/wav' ||
        selectedFile.type === 'audio/mp3'
      ) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please upload a valid file (text, PDF, PowerPoint, image, or audio)');
      }
    }
  };
  const handleSubmit = async () => {
    if (!prompt && !file) {
      alert("Please enter a prompt or upload a file!");
      return;
    }

    if (!selectedOutputType) {
      alert("Please select an output type!");
      return;
    }

    if (!taskConfig) {
      alert("No task configuration found. Please set up your preferences in Settings first.");
      return;
    }

    setMessages(prev => [
      ...prev,
      { type: "user", content: prompt || file?.name }
    ]);
    setLoading(true);

    try {
      // Create a task using the config ID directly from the settings page
      const formData = new FormData();
      // Use actual user ID from auth context if available
      const userId = user?.id || "current-user-id";
      formData.append("user_id", userId);
      formData.append("task_config_id", taskConfig.id);
      formData.append("input_content_type_id", "c0a80101-0000-0000-0000-000000000021");
      formData.append("output_content_type_id", selectedOutputType);
      formData.append("user_prompt", prompt);
      
      if (file) {
        formData.append("files", file);
      }

      const taskResponse = await fetch("/api/task", {
        method: "POST",
        body: formData,
      });
      
      const taskData = await taskResponse.json();
      
      if (!taskData.success) {
        throw new Error("Failed to create task");
      }

      // Success response
      setMessages(prev => [
        ...prev,
        { 
          type: "bot", 
          content: "Task created successfully! Your document will be processed and the results will be available shortly." 
        }
      ]);

      // Reset input
      setPrompt("");
      setFile(null);
    } catch (error) {
      console.error("Task creation failed:", error);
      setMessages(prev => [
        ...prev,
        { type: "bot", content: "Failed to create task. Please try again later." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col overflow-hidden" style={{ height: "89vh" }}>
      <main className="flex-1 flex flex-col" style={{ height: '100%' }}>
        <div className={`flex flex-col flex-1 p-3 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="max-w-4xl mx-auto flex flex-col flex-1 w-full">
            {/* Welcome Section */}
            {messages.length === 0 && (
              <div className="mb-6 text-center w-full">
                <h2 className="text-2xl font-bold mb-2" style={{ color: theme.colors.text }}>
                  Welcome to your Dashboard
                </h2>
                <p style={{ color: theme.colors.icon }}>
                  Start a conversation or upload files using the input box below.
                </p>
              </div>
            )}

            {/* Chat Area */}
            <div
              className="flex-1 overflow-y-auto rounded-lg shadow pt-4 pb-25 pl-4 pr-4 space-y-4 w-full"
              style={{
                backgroundColor: isDarkMode ? theme.colors.cardBg : 'white',
                minHeight: "85vh",
                maxHeight: '82vh',
                overflowY: 'auto',
              }}
              ref={chatAreaRef}
            >
              {messages.length === 0 ? (
                <div className="text-center mt-20" style={{ color: theme.colors.icon }}>
                  <FontAwesomeIcon icon={faComments} className="text-4xl mb-3" />
                  <p>Your conversations will appear here</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className="p-3 rounded break-words w-full"
                    style={{
                      backgroundColor: msg.type === "user"
                        ? (isDarkMode ? '#2563eb33' : '#bfdbfe')
                        : (isDarkMode ? '#22c55e33' : '#bbf7d0'),
                      color: theme.colors.text
                    }}
                  >
                    {msg.content}
                  </div>
                ))
              )}
            </div>

            {/* Input Section */}
            <div className="p-4 border-t w-full"
              style={{
                backgroundColor: isDarkMode ? theme.colors.cardBg : 'white',
                borderColor: theme.colors.border,
                position: 'sticky',
                bottom: 0
              }}
            >
              <div className="flex items-end rounded-lg p-4 w-full"
                style={{
                  backgroundColor: isDarkMode ? theme.colors.background : 'rgb(243, 244, 246)'
                }}
              >
                {/* File upload section */}
                <div className="grid gap-1 mr-4">
                  <div>
                    {file ? (
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4 mr-2" />
                        <span className="text-sm">{file.name}</span>
                        <button
                          className="px-2 py-1 bg-red-500 text-white text-xs rounded"
                          onClick={() => setFile(null)}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors duration-200">
                        <FontAwesomeIcon icon={faPlus} className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".txt,.pdf,.pptx,.png,.jpg,.jpeg,.mp3,.wav"
                          />
                      </label>
                    )}
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>

                {/* Textarea */}
                <textarea
                  placeholder="Type a message or attach files..."
                  className="flex-1 border-none outline-none resize-none text-sm min-h-[40px] max-h-[120px] overflow-auto"
                  style={{
                    backgroundColor: 'transparent',
                    color: theme.colors.inputText,
                    fontFamily: theme.fonts.input
                  }}
                  rows="1"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                ></textarea>
                
                {/* Output Type Dropdown */}
                <div className="ml-2">
                  <select 
                    className="px-3 py-2 border rounded text-sm"
                    style={{
                      backgroundColor: isDarkMode ? theme.colors.cardBg : 'white',
                      color: theme.colors.text,
                      borderColor: theme.colors.border
                    }}
                    value={selectedOutputType || ""}
                    onChange={(e) => setSelectedOutputType(e.target.value)}
                  >
                    <option value="" disabled>Output Format</option>
                    {contentTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Send Button */}
                <div className="flex items-center ml-2">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`ml-2 px-4 py-2 rounded text-white whitespace-nowrap ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
                    style={{
                      backgroundColor: loading ? `${theme.colors.primary}80` : theme.colors.primary
                    }}
                  >
                    <FontAwesomeIcon icon={faPaperPlane} className="mr-1" /> {loading ? "Sending..." : "Send"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}