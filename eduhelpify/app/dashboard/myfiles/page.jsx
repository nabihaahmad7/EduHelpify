// app/myfiles/page.js
"use client";

import { useTheme } from "../../../contexts/ThemeContext";

export default function MyFiles() {
  const { theme, isDarkMode } = useTheme();

  const cardData = [
    { title: "Analysis Report", type: "Input", date: "Apr 20, 2025", size: "2.4 MB" },
    { title: "Customer Survey", type: "Input", date: "Apr 19, 2025", size: "1.8 MB" },
    { title: "Raw Dataset", type: "Input", date: "Apr 18, 2025", size: "8.5 MB" },
    { title: "Visualization Data", type: "Output", date: "Apr 18, 2025", size: "5.1 MB" },
    { title: "User Feedback", type: "Input", date: "Apr 17, 2025", size: "1.2 MB" },
  ];

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: theme.colors.primary }}>
            My Files
          </h1>
          <p className={`${isDarkMode ? "text-gray-300" : "text-[#6c6c6c]"}`}>
            Manage your input and output files
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-2 rounded-lg whitespace-nowrap border ${
              isDarkMode
                ? "bg-gray-800 text-gray-300 border-gray-600"
                : "bg-white text-[#6c6c6c] border-[#afafaf]"
            }`}
          >
            <i className="fas fa-list mr-2"></i>List View
          </button>
          <button className="px-3 py-2 rounded-lg whitespace-nowrap bg-[#01b3ef] text-white">
            <i className="fas fa-th-large mr-2"></i>Grid View
          </button>
        </div>
      </div>

      <div
        className={`rounded-lg shadow-sm p-4 mb-6 flex justify-between items-center ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <input
              type="checkbox"
              id="selectAll"
              className="w-4 h-4 cursor-pointer"
              style={{ accentColor: theme.colors.primary }}
            />
            <label
              htmlFor="selectAll"
              className={`ml-2 cursor-pointer ${isDarkMode ? "text-gray-300" : "text-[#6c6c6c]"}`}
            >
              Select All
            </label>
          </div>
          <span className={isDarkMode ? "text-gray-300" : "text-[#6c6c6c]"}>6 selected</span>
        </div>
        <div>
          <button className="bg-[#e14177] text-white px-4 py-2 rounded-lg whitespace-nowrap hover:bg-opacity-90">
            <i className="fas fa-trash-alt mr-2"></i>Delete Selected
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cardData.map((file, index) => (
          <div
            key={index}
            className={`rounded-lg shadow-sm overflow-hidden transition-shadow duration-200 ring-2 ring-[#01b3ef] ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="h-2" style={{ backgroundColor: getColor(file.type) }}></div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 cursor-pointer mr-3"
                    style={{ accentColor: theme.colors.primary }}
                  />
                  <i className={`fas ${getIcon(file.type)} text-2xl mr-3`} style={{ color: getColor(file.type) }}></i>
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
                <span>{file.date}</span>
                <span>{file.size}</span>
              </div>
              <div
                className="flex justify-between border-t pt-3"
                style={{ borderColor: theme.colors.border }}
              >
                <button
                  className={`hover:text-[#01b3ef] cursor-pointer ${
                    isDarkMode ? "text-gray-400" : "text-[#6c6c6c]"
                  }`}
                >
                  <i className="fas fa-eye"></i>
                </button>
                <button
                  className={`hover:text-[#01b3ef] cursor-pointer ${
                    isDarkMode ? "text-gray-400" : "text-[#6c6c6c]"
                  }`}
                >
                  <i className="fas fa-download"></i>
                </button>
                <button
                  className={`hover:text-[#e14177] cursor-pointer ${
                    isDarkMode ? "text-gray-400" : "text-[#6c6c6c]"
                  }`}
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
