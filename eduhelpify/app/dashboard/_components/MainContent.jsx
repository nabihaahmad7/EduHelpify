"use client";
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPlus, faComments } from '@fortawesome/free-solid-svg-icons';

export default function MainContent() {
  const { theme, isDarkMode } = useTheme();

  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatAreaRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => file.size <= 10 * 1024 * 1024); // 10MB limit

    if (validFiles.length !== selectedFiles.length) {
      alert("Some files exceed 10MB and were not added.");
    }

    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleSubmit = async () => {
    if (!prompt && files.length === 0) {
      alert("Please enter a prompt or upload files!");
      return;
    }

    setMessages(prev => [
      ...prev,
      { type: "user", content: prompt || files.map(f => f.name).join(", ") }
    ]);
    setLoading(true);

    try {
      // 1. Simulate task creation
      const fakeTaskId = Date.now(); // Replace with real task ID from backend if needed

      // 2. Upload each file with task_id
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("task_id", fakeTaskId);

        await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
      }

      // 3. Dummy AI response
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { type: "bot", content: "Files and prompt submitted successfully." }
        ]);
        setLoading(false);
      }, 1000);

      // Reset input
      setPrompt("");
      setFiles([]);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Something went wrong!");
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
                {/* Upload File Button */}
                <label className="p-2 mr-2 rounded-full hover:bg-opacity-20 hover:bg-gray-500 cursor-pointer" style={{ color: theme.colors.icon }}>
                  <FontAwesomeIcon icon={faPlus} />
                  <input type="file" className="hidden" onChange={handleFileChange} multiple />
                </label>

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

                {/* File List */}
                {files.length > 0 && (
                  <div className="text-xs text-gray-500 ml-2 max-w-[200px] truncate">
                    Attached: {files.map(f => f.name).join(', ')}
                  </div>
                )}

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
