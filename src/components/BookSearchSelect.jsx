import { useEffect, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { getBooks } from "../app/api/adminapi";

export default function BookSearchSelect({
  value,
  onChange,
  disabled = false,
}) {
  const [query, setQuery] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const listId = "book-search-options";

  useEffect(() => {
    if (!isOpen || query === null) return undefined;

    const search = query.trim();
    if (!search) return undefined;

    let active = true;
    const timeout = setTimeout(async () => {
      setLoading(true);
      setError("");
      const result = await getBooks({ limit: 100, q: search });
      if (!active) return;

      setLoading(false);
      if (result.success) {
        setBooks(result.data?.items || []);
      } else {
        setBooks([]);
        setError(result.message || "Could not search books.");
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [isOpen, query]);

  const visibleBooks = books;

  const selectBook = (book) => {
    setSelectedBook(book);
    onChange(book.id);
    setQuery(null);
    setIsOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      setQuery(null);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) => Math.min(index + 1, Math.max(visibleBooks.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && isOpen && visibleBooks[activeIndex]) {
      event.preventDefault();
      selectBook(visibleBooks[activeIndex]);
    }
  };

  return (
    <div className="relative">
      <div className="flex w-full items-center rounded-lg border border-gray-200 bg-white px-3 focus-within:border-[#294C3B]">
        <Search size={16} className="shrink-0 text-gray-400" aria-hidden="true" />
        <input
          type="text"
          role="combobox"
          aria-label="Search and select a book"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listId}
          aria-activedescendant={isOpen && visibleBooks[activeIndex] ? `book-option-${visibleBooks[activeIndex].id}` : undefined}
          value={query ?? (selectedBook ? `${selectedBook.name} — ${selectedBook.author}` : "")}
          onFocus={() => {
            setQuery("");
            setBooks([]);
            setError("");
            setLoading(false);
            setActiveIndex(0);
            setIsOpen(true);
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            if (!event.target.value.trim()) {
              setBooks([]);
              setError("");
              setLoading(false);
            }
            setActiveIndex(0);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          onBlur={(event) => {
            if (!event.currentTarget.parentElement?.parentElement?.contains(event.relatedTarget)) {
              setIsOpen(false);
              setQuery(null);
            }
          }}
          placeholder={loading ? "Searching books..." : "Search by title or author"}
          disabled={disabled}
          className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setSelectedBook(null);
              setQuery("");
              setIsOpen(true);
            }}
            aria-label="Clear selected book"
            className="rounded p-1 text-gray-400 hover:text-gray-700"
          >
            <X size={15} />
          </button>
        )}
        <ChevronDown size={16} className="shrink-0 text-gray-400" aria-hidden="true" />
      </div>

      {isOpen && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Books"
          className="absolute z-20 mt-2 max-h-56 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white p-1 shadow-xl"
        >
          {loading ? (
            <li className="px-3 py-3 text-sm text-gray-400">Searching books...</li>
          ) : error ? (
            <li className="px-3 py-3 text-sm text-red-500">{error}</li>
          ) : !query?.trim() ? (
            <li className="px-3 py-3 text-sm text-gray-400">Type a title, author, or ISBN to search.</li>
          ) : visibleBooks.length === 0 ? (
            <li className="px-3 py-3 text-sm text-gray-400">No matching books found.</li>
          ) : (
            visibleBooks.map((book, index) => {
              const isSelected = String(book.id) === String(value);
              return (
                <li
                  key={book.id}
                  id={`book-option-${book.id}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectBook(book)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm ${
                    index === activeIndex ? "bg-[#f5ede0]" : "hover:bg-[#f5ede0]"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-gray-800">{book.name}</span>
                    <span className="block truncate text-xs text-gray-500">
                      {book.author} · ₹{book.price} · {book.stock} in stock
                    </span>
                  </span>
                  {isSelected && <Check size={16} className="shrink-0 text-[#294C3B]" />}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
