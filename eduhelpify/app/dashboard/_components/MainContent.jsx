"use client";
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPlus, faComments } from '@fortawesome/free-solid-svg-icons';

export default function MainContent() {
  const { theme, isDarkMode } = useTheme();

  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatAreaRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
// Dummy response
  const handleSubmit = async () => {
    if (!prompt && !file) {
      alert("Please enter a prompt or upload a file!");
      return;
    }

    setMessages(prev => [
      ...prev,
      { type: "user", content: prompt || (file ? file.name : "File Uploaded") }
    ]);

    setLoading(true);
    setPrompt("");
    setFile(null);

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { type: "bot", content: "This is a dummy AI response based on your message." }
      ]);
      setLoading(false);
    }, 1500);
  };
  // const handleSubmit = async () => {
  //   if (!prompt && !file) {
  //     alert("Please enter a prompt or upload a file!");
  //     return;
  //   }

  //   const formData = new FormData();
  //   if (file) {
  //     formData.append("file", file);
  //   }
  //   formData.append("prompt", prompt);

  //   setLoading(true);

  //   try {
  //     const res = await fetch("/api/your-endpoint", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!res.ok) {
  //       throw new Error("Server Error");
  //     }

  //     const data = await res.json();

  //     // Add both prompt and response to messages
  //     setMessages(prev => [
  //       ...prev,
  //       { type: "user", content: prompt || (file ? file.name : "File Uploaded") },
  //       { type: "bot", content: data.response }
  //     ]);

  //     // Reset input
  //     setPrompt("");
  //     setFile(null);

  //   } catch (error) {
  //     console.error("API Error:", error);
  //     alert("Something went wrong!");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Scroll to the bottom when a new message is added
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col overflow-hidden" style={{ height: "89vh" }}>
      <main className="flex-1 flex flex-col" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div className={`flex flex-col flex-1 p-3 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="max-w-4xl mx-auto flex flex-col flex-1 w-full">
            {/* Top Section */}
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
              className="flex-1 overflow-y-auto rounded-lg shadow p-4 space-y-4 w-full"
              style={{
                backgroundColor: isDarkMode ? theme.colors.cardBg : 'white',
                minHeight:"85vh",
                maxHeight: 'calc(89vh - 180px)',  
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
                {/* Upload File */}
                <label className="p-2 mr-2 rounded-full hover:bg-opacity-20 hover:bg-gray-500 cursor-pointer" style={{ color: theme.colors.icon }}>
                  <FontAwesomeIcon icon={faPlus} />
                  <input type="file" className="hidden" onChange={handleFileChange} />
                </label>
  {/* Show uploaded file name before sending */}


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
