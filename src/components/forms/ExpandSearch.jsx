import { useState, useRef } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ExpandSearch() {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const isExpanded = focused || value.length > 0;

  const handleSearch = (e) => {
    if (e.key === 'Enter' && value.trim()) {
      const searchUrl = `/search?q=${encodeURIComponent(value.trim())}`;
      console.log(`🚀 [DEBUG] ExpandSearch navigating to: ${searchUrl}`);
      navigate(searchUrl);
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleIconClick = () => {
    if (!isExpanded) {
      inputRef.current?.focus();
    } else if (value.trim()) {
      const searchUrl = `/search?q=${encodeURIComponent(value.trim())}`;
      console.log(`🚀 [DEBUG] ExpandSearch (icon click) navigating to: ${searchUrl}`);
      navigate(searchUrl);
    }
  };


  const handleClear = () => {
    setValue("");
    inputRef.current?.blur();
  };


  return (
    <div className={`transition-all duration-300 ${isExpanded ? "flex-1 mx-2" : ""}`}>
      <div className={`relative flex items-center h-10 ${isExpanded ? "w-[260px]" : ""}`}>
        {/* Icon — rotates on hover when collapsed, becomes inline icon when expanded */}
        <button
          onClick={handleIconClick}
          tabIndex={-1}
          className={`
            absolute left-0 top-0 z-10
            h-10 w-10 flex items-center justify-center
            transition-all duration-200 ease-in-out
            ${isExpanded
              ? "border-transparent bg-transparent text-gray-800 cursor-default"
              : "border-gray-800  text-gray-800 cursor-pointer"
            }
          `}
        >
          <Search size={20} strokeWidth={1.5} />
        </button>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Search something..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleSearch}
          className={`
            h-10 rounded-[10px] outline-none border text-sm
            text-gray-700 placeholder-gray-400
            transition-all duration-500 ease-in-out
            ${isExpanded
              ? "w-full pl-10 pr-10 border-gray-600 cursor-text"
              : "w-10 pl-10 pr-0 bg-transparent border-transparent cursor-pointer"
            }
          `}
        />


        {/* Clear button — appears when expanded */}
        {isExpanded && (
          <button
            onClick={handleClear}
            tabIndex={-1}
            className="absolute right-2 top-0 z-10 h-10 w-10 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
          >
            <X size={18} strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  );
}
