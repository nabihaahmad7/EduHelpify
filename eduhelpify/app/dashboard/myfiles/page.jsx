// app/myfiles/page.js
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function MyFiles() {
  const { theme, isDarkMode } = useTheme();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch("/api/files");
        const data = await res.json();
        setFiles(data);
      } catch (error) {
        console.error("Failed to fetch files:", error);
      }
    };

    fetchFiles();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/files/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setFiles((prev) => prev.filter((file) => file.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const getIcon = (type) => {
    return type === "Output" ? "fa-file-download" : "fa-file-upload";
  };

  const getColor = (type) => {
    return type === "Output" ? "#01b3ef" : "#01427a";
  };

  const getBadgeColor = (type) => {
    return type === "Output" ? "bg-[#e8fcff] text-[#01b3ef]" : "bg-[#e8f4ff] text-[#01427a]";
  };

  return (
    <main className={`flex-1 overflow-y-auto p-8 ${isDarkMode ? "bg-gray-900" : "bg-[#f5f5f5]"}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: theme.colors.primary }}>
          My Files
        </h1>
        <p className={`${isDarkMode ? "text-gray-300" : "text-[#6c6c6c]"}`}>
          Manage your input and output files
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {files.map((file) => (
          <div
            key={file.id}
            className={`rounded-lg shadow-sm overflow-hidden transition-shadow duration-200 ring-2 ring-[#01b3ef] ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="h-2" style={{ backgroundColor: getColor(file.type) }}></div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <i
                    className={`fas ${getIcon(file.type)} text-2xl mr-3`}
                    style={{ color: getColor(file.type) }}
                  ></i>
                </div>
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${getBadgeColor(file.type)}`}>
                  {file.type}
                </span>
              </div>
              <h3 className="font-medium text-lg mb-2" style={{ color: theme.colors.text }}>
                {file.title}
              </h3>
              <div
                className={`flex justify-between text-sm mb-4 ${
                  isDarkMode ? "text-gray-400" : "text-[#6c6c6c]"
                }`}
              >
                <span>{new Date(file.date).toLocaleDateString()}</span>
                <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
              <div className="flex justify-between border-t pt-3" style={{ borderColor: theme.colors.border }}>
                <button className={`hover:text-[#01b3ef] ${isDarkMode ? "text-gray-400" : "text-[#6c6c6c]"}`}>
                  <i className="fas fa-eye"></i>
                </button>
                <button className={`hover:text-[#01b3ef] ${isDarkMode ? "text-gray-400" : "text-[#6c6c6c]"}`}>
                  <i className="fas fa-download"></i>
                </button>
                <button
                  onClick={() => handleDelete(file.id)}
                  className={`hover:text-[#e14177] ${isDarkMode ? "text-gray-400" : "text-[#6c6c6c]"}`}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
