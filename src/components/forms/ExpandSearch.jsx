import { useState, useRef } from "react";
import { Search } from "lucide-react";

export default function ExpandSearch() {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  const isExpanded = focused || value.length > 0;

  const handleIconClick = () => {
    if (!isExpanded) {
      inputRef.current?.focus();
    }
  };

  return (
    <div className="">
      <div className="relative flex items-center h-10">
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
          className={`
            h-10 rounded-[10px] outline-none border text-sm
            text-gray-700 placeholder-gray-400
            transition-all duration-500 ease-in-out
            ${isExpanded
              ? "w-72 pl-10 pr-4  border-gray-600 cursor-text"
              : "w-10 pl-10 pr-0 bg-transparent border-transparent cursor-pointer"
            }
          `}
        />
      </div>
    </div>
  );
}