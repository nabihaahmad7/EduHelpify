"use client";
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPlus, faComments } from '@fortawesome/free-solid-svg-icons';

export default function MainContent() {
  const { theme, isDarkMode } = useTheme();

  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const chatAreaRef = useRef(null);

  // Handle file selection and validation (only .txt and .pdf files)
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/plain' || selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please upload a .txt or .pdf file');
      }
    }
  };

  const handleSubmit = async () => {
    if (!prompt && !file) {
      alert("Please enter a prompt or upload a file!");
      return;
    }

    setMessages(prev => [
      ...prev,
      { type: "user", content: prompt || file?.name }
    ]);
    setLoading(true);

    try {
      // Simulate task creation
      const fakeTaskId = Date.now(); // Replace with real task ID from backend if needed

      // Upload file with task_id
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("task_id", fakeTaskId.toString());

        await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
      }

      // Dummy AI response
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { type: "bot", content: "File and prompt submitted successfully." }
        ]);
        setLoading(false);
      }, 1000);

      // Reset input
      setPrompt("");
      setFile(null);
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
                {/* File upload section */}
                <div className="grid gap-2">
                  <label>File</label>
                  <div>
                    {file ? (
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faPaperPlane} className="h-5 w-5" />
                        <span>{file.name}</span>
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded"
                          onClick={() => setFile(null)}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center gap-2 rounded-md border-2 border-dashed border-muted p-4 text-muted-foreground cursor-pointer">
                        <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
                        <span>Drop a file or click to upload</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".txt,.pdf"
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
