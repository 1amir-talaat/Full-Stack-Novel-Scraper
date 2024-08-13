import React, { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider"; // Ensure to import the useTheme hook

export default function SearchBar({ setKeyWord, setSearch, keyword }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  let typingTimer = null;

  const handleInputChange = (event) => {
    const value = event.target.value;
    setKeyWord(value);

    // Clear previous timer
    clearTimeout(typingTimer);

    // Set a new timer to trigger search after 1.2 seconds
    typingTimer = setTimeout(() => {
      setSearch(true);
    }, 1200);
  };

  const handleSearchClick = () => {
    // Clear previous timer
    clearTimeout(typingTimer);

    setSearch(true);
  };

  return (
    <>
      <div className="flex items-center justify-center mb-6">
        <input
          type="text"
          placeholder="Search"
          className={`w-full max-w-2xl p-3 border rounded-l-md text-lg outline-none relative dark:bg-gray-800 dark:text-white dark:border-gray-700 $ bg-white text-black border-gray-300`}
          value={keyword}
          onChange={handleInputChange}
        />
        <button className="bg-[#e57373] text-white rounded-r-md p-2" style={{ padding: "0.92rem" }} onClick={handleSearchClick}>
          <SearchIcon className="w-6 h-6" />
        </button>
      </div>
    </>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
