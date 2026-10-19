import { Search } from "lucide-react";
import { useState, useEffect } from "react";

function SearchBox({ placeholder = "Search...", onChange, value, onSearch, className = "" }) {
  const [local, setLocal] = useState(value || '');

  useEffect(() => {
    if (!onSearch) return;
    const t = setTimeout(() => onSearch(local), 400);
    return () => clearTimeout(t);
  }, [local]);

  const handleChange = (e) => {
    setLocal(e.target.value);
    onChange?.(e);
  };

  return (
    <div className={`flex items-center bg-white border border-bg1 rounded-full overflow-hidden active:border-bg2 max-w-[400px] max-[1024px]:max-w-none max-[1024px]:w-[55%] min-w-[225px] w-auto ${className}`}>
      <input
        type="text"
        value={onSearch ? local : value}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 px-4 py-2 text-[13px] text-black outline-none bg-transparent text-sm placeholder:text-[11px]"
      />
      <div className="px-2 py-2 bg-bg2 text-brand1 cursor-pointer rounded-full mx-1">
        <Search size={18} />
      </div>
    </div>
  );
}

export default SearchBox;
